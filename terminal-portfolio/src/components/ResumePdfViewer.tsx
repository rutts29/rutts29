"use client";

import { useEffect, useRef, useState } from "react";

import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist";

type ViewerStatus = "loading" | "ready" | "error";

export function ResumePdfViewer({
  source,
  openUrl,
}: {
  source: string;
  openUrl: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  const [documentProxy, setDocumentProxy] =
    useState<PDFDocumentProxy | null>(null);
  const [status, setStatus] = useState<ViewerStatus>("loading");

  useEffect(() => {
    let active = true;
    let loadingTask: PDFDocumentLoadingTask | undefined;

    const load = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        // The Blob is replaced in place when the resume changes. A unique
        // query keeps each newly opened tab fresh without requiring visitors
        // to clear a previously cached PDF.
        const freshSource = new URL(source, window.location.origin);
        freshSource.searchParams.set(
          "portfolio-version",
          String(Date.now()),
        );

        loadingTask = pdfjs.getDocument({ url: freshSource.toString() });
        const pdf = await loadingTask.promise;
        if (!active) {
          await loadingTask.destroy();
          return;
        }

        canvasRefs.current = Array.from(
          { length: pdf.numPages },
          (_, index) => canvasRefs.current[index] ?? null,
        );
        setDocumentProxy(pdf);
      } catch {
        if (active) setStatus("error");
      }
    };

    void load();

    return () => {
      active = false;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [source]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !documentProxy) return;

    let frameId = 0;
    let generation = 0;
    let zoomTimer: ReturnType<typeof setTimeout> | undefined;
    let lastRenderKey = "";
    let hasRendered = false;
    let renderTasks: RenderTask[] = [];

    const requestedOutputScale = () => {
      const deviceScale = Math.max(1, window.devicePixelRatio || 1);
      const zoomScale = Math.max(1, window.visualViewport?.scale ?? 1);

      // A high-density redraw keeps text sharp after mobile pinch zoom. Eight
      // device pixels per CSS pixel remains below common mobile canvas limits
      // for this one-page, phone-width document.
      return Math.min(deviceScale * zoomScale, 8);
    };

    const renderPages = async (
      availableWidth: number,
      targetOutputScale: number,
    ) => {
      const currentGeneration = ++generation;
      renderTasks.forEach((task) => task.cancel());
      renderTasks = [];
      if (!hasRendered) setStatus("loading");

      try {
        for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
          if (currentGeneration !== generation) return;

          const page = await documentProxy.getPage(pageNumber);
          const canvas = canvasRefs.current[pageNumber - 1];
          if (!canvas) continue;

          const baseViewport = page.getViewport({ scale: 1 });
          const cssScale = availableWidth / baseViewport.width;
          const cssWidth = baseViewport.width * cssScale;
          const cssHeight = baseViewport.height * cssScale;
          const dimensionLimit = Math.min(
            4096 / cssWidth,
            4096 / cssHeight,
          );
          const areaLimit = Math.sqrt(
            16_000_000 / (cssWidth * cssHeight),
          );
          const outputScale = Math.max(
            1,
            Math.min(targetOutputScale, dimensionLimit, areaLimit),
          );
          const viewport = page.getViewport({ scale: cssScale * outputScale });

          // Render offscreen so a zoom-quality refresh does not clear the
          // currently visible page while PDF.js is drawing the sharper copy.
          const nextCanvas = document.createElement("canvas");
          nextCanvas.width = Math.floor(viewport.width);
          nextCanvas.height = Math.floor(viewport.height);

          const task = page.render({
            canvas: nextCanvas,
            viewport,
            background: "rgb(255,255,255)",
          });
          renderTasks.push(task);
          await task.promise;

          if (currentGeneration !== generation) return;

          canvas.width = nextCanvas.width;
          canvas.height = nextCanvas.height;
          canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
          canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;

          const context = canvas.getContext("2d", { alpha: false });
          if (!context) throw new Error("Canvas rendering is unavailable");
          context.drawImage(nextCanvas, 0, 0);
        }

        if (currentGeneration === generation) {
          hasRendered = true;
          setStatus("ready");
        }
      } catch (error) {
        if (
          currentGeneration === generation &&
          !hasRendered &&
          !(error instanceof Error && error.name === "RenderingCancelledException")
        ) {
          setStatus("error");
        }
      }
    };

    const scheduleRender = (measuredWidth = container.clientWidth) => {
      const availableWidth = Math.max(280, Math.floor(measuredWidth));
      const outputScale = requestedOutputScale();
      const renderKey = `${availableWidth}:${outputScale.toFixed(2)}`;
      if (renderKey === lastRenderKey) return;
      lastRenderKey = renderKey;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() =>
        void renderPages(availableWidth, outputScale),
      );
    };

    const scheduleZoomRender = () => {
      if (zoomTimer) clearTimeout(zoomTimer);
      zoomTimer = setTimeout(() => scheduleRender(), 140);
    };

    const observer = new ResizeObserver(([entry]) => {
      scheduleRender(entry.contentRect.width);
    });
    const visualViewport = window.visualViewport;
    observer.observe(container);
    visualViewport?.addEventListener("resize", scheduleZoomRender);
    window.addEventListener("resize", scheduleZoomRender);
    scheduleRender();

    return () => {
      generation += 1;
      cancelAnimationFrame(frameId);
      if (zoomTimer) clearTimeout(zoomTimer);
      observer.disconnect();
      visualViewport?.removeEventListener("resize", scheduleZoomRender);
      window.removeEventListener("resize", scheduleZoomRender);
      renderTasks.forEach((task) => task.cancel());
    };
  }, [documentProxy]);

  return (
    <div
      className="simple-pdf-viewer"
      ref={containerRef}
      aria-busy={status === "loading"}
      data-status={status}
    >
      {status === "loading" ? (
        <div className="simple-pdf-status" role="status">
          Rendering resume…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="simple-resume-fallback" role="alert">
          <p className="simple-body-copy">
            The inline preview could not be loaded.
          </p>
          <a
            className="simple-btn-primary"
            href={openUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Open resume
          </a>
        </div>
      ) : null}

      {documentProxy ? (
        <div
          className="simple-pdf-pages"
          data-ready={status === "ready" ? "true" : "false"}
        >
          {Array.from({ length: documentProxy.numPages }, (_, index) => (
            <canvas
              aria-label={`Resume page ${index + 1} of ${documentProxy.numPages}`}
              className="simple-pdf-page"
              key={index}
              ref={(canvas) => {
                canvasRefs.current[index] = canvas;
              }}
              role="img"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
