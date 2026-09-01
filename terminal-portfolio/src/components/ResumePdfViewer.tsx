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
    let lastWidth = 0;
    let renderTasks: RenderTask[] = [];

    const renderPages = async (availableWidth: number) => {
      const currentGeneration = ++generation;
      renderTasks.forEach((task) => task.cancel());
      renderTasks = [];
      setStatus("loading");

      try {
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
          if (currentGeneration !== generation) return;

          const page = await documentProxy.getPage(pageNumber);
          const canvas = canvasRefs.current[pageNumber - 1];
          if (!canvas) continue;

          const baseViewport = page.getViewport({ scale: 1 });
          const cssScale = availableWidth / baseViewport.width;
          const viewport = page.getViewport({ scale: cssScale * outputScale });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
          canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;

          const task = page.render({
            canvas,
            viewport,
            background: "rgb(255,255,255)",
          });
          renderTasks.push(task);
          await task.promise;
        }

        if (currentGeneration === generation) setStatus("ready");
      } catch (error) {
        if (
          currentGeneration === generation &&
          !(error instanceof Error && error.name === "RenderingCancelledException")
        ) {
          setStatus("error");
        }
      }
    };

    const scheduleRender = (measuredWidth = container.clientWidth) => {
      const availableWidth = Math.max(280, Math.floor(measuredWidth));
      if (availableWidth === lastWidth) return;
      lastWidth = availableWidth;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => void renderPages(availableWidth));
    };

    const observer = new ResizeObserver(([entry]) => {
      scheduleRender(entry.contentRect.width);
    });
    observer.observe(container);
    scheduleRender();

    return () => {
      generation += 1;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderTasks.forEach((task) => task.cancel());
    };
  }, [documentProxy]);

  return (
    <div
      className="simple-pdf-viewer"
      ref={containerRef}
      aria-busy={status === "loading"}
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
