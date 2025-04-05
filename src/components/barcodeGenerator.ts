import JsBarcode from "jsbarcode";

export const generateBarcodeSVG = (text: string): string => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  JsBarcode(svg, text, {
    format: "CODE128",
    displayValue: true,
    width: 2,
    height: 40,
  });
  return svg.outerHTML;
};
