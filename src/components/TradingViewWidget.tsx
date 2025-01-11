import { useEffect, useRef, memo } from "react";

function TradingViewWidget({ symbol = "BTCUSD" }: { symbol?: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up existing content
    if (container.current) {
      container.current.innerHTML = "";
    }

    if (!container.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const scriptContent = {
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_top_toolbar: true,
      save_image: false,
      container_id: "tradingview_widget",
    };

    script.innerHTML = JSON.stringify(scriptContent);
    container.current.appendChild(script);

    // Cleanup function
    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, [symbol]); // Re-run effect when symbol changes

  return (
    <div
      id="tradingview_widget"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export default memo(TradingViewWidget);
