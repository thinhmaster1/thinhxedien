const SALES_PHONE = "0352 978 519";
const SALES_ADVISOR = "Bùi Đắc Thịnh";
const QUOTE_IMAGE_WIDTH = 1080;
const QUOTE_IMAGE_FONT = '-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif';
const fileNamePart = value => String(value || "")
  .replace(/Đ/g,"D")
  .replace(/đ/g,"d")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"")
  .replace(/[^a-zA-Z0-9]+/g,"-")
  .replace(/^-+|-+$/g,"")
  .slice(0,60)
  .replace(/-+$/g,"");

export function quoteImageFileName(car, paymentMode, { customerName = "", customerPhone = "" } = {}, date = new Date()) {
  const paymentName = paymentMode === "cash" ? "Tra-thang" : "Tra-gop";
  const namePart = fileNamePart(customerName);
  const phonePart = String(customerPhone).replace(/\D/g,"").slice(0,15);
  const datePart = [date.getFullYear(),String(date.getMonth() + 1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
  return [
    "Bao-gia",
    "VinFast",
    fileNamePart(car?.name || car?.slug || "Xe"),
    paymentName,
    namePart ? `Khach-${namePart}` : "",
    phonePart ? `SDT-${phonePart}` : "",
    datePart
  ].filter(Boolean).join("-") + ".png";
}

const setCanvasFont = (context, size, weight = 400) => {
  context.font = `${weight} ${size}px ${QUOTE_IMAGE_FONT}`;
};

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius,width / 2,height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius,y);
  context.arcTo(x + width,y,x + width,y + height,safeRadius);
  context.arcTo(x + width,y + height,x,y + height,safeRadius);
  context.arcTo(x,y + height,x,y,safeRadius);
  context.arcTo(x,y,x + width,y,safeRadius);
  context.closePath();
}

function wrappedLines(context, text, maxWidth) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).flatMap(word => {
    if (context.measureText(word).width <= maxWidth) return [word];
    const chunks = [];
    let chunk = '';
    for (const character of word) {
      if (chunk && context.measureText(chunk + character).width > maxWidth) { chunks.push(chunk); chunk = ''; }
      chunk += character;
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
  if (!words.length) return [];
  const lines = [];
  let line = words.shift();
  words.forEach(word => {
    const candidate = `${line} ${word}`;
    if (context.measureText(candidate).width <= maxWidth) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  });
  lines.push(line);
  return lines;
}

function rowLayout(context, row, labelWidth) {
  if (row.isDivider) return { labelLines:[row.label],noteLines:[],height:58 };
  setCanvasFont(context,22,600);
  const labelLines = wrappedLines(context,row.label,labelWidth);
  setCanvasFont(context,17,400);
  const noteLines = wrappedLines(context,row.note,labelWidth);
  return { labelLines, noteLines, height: Math.max(66,18 + labelLines.length * 28 + noteLines.length * 22 + 14) };
}

function rowsHeight(context, rows, labelWidth) {
  return rows.reduce((height,row) => height + rowLayout(context,row,labelWidth).height,0);
}

function drawRows(context, rows, x, y, width) {
  const labelWidth = width - 350;
  rows.forEach((row,index) => {
    const layout = rowLayout(context,row,labelWidth);
    if (row.isDivider) {
      context.strokeStyle = "#d7dde4";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x,y + 10.5);
      context.lineTo(x + width,y + 10.5);
      context.stroke();
      context.textAlign = "left";
      context.fillStyle = "#0879e8";
      setCanvasFont(context,16,750);
      context.fillText(row.label.toUpperCase(),x,y + 27);
      y += layout.height;
      return;
    }
    if (row.isTotal) {
      context.fillStyle = "#edf6ff";
      roundedRect(context,x - 12,y + 4,width + 24,layout.height - 8,14);
      context.fill();
    }
    context.textAlign = "left";
    context.fillStyle = row.isTotal ? "#0879e8" : "#1d1d1f";
    setCanvasFont(context,22,row.isTotal ? 750 : 600);
    layout.labelLines.forEach((line,lineIndex) => context.fillText(line,x,y + 15 + lineIndex * 28));
    context.fillStyle = "#6e6e73";
    setCanvasFont(context,17,400);
    const noteTop = y + 16 + layout.labelLines.length * 28;
    layout.noteLines.forEach((line,lineIndex) => context.fillText(line,x,noteTop + lineIndex * 22));
    context.textAlign = "right";
    context.fillStyle = row.isTotal ? "#0879e8" : "#1d1d1f";
    setCanvasFont(context,row.isTotal ? 26 : 22,750);
    context.fillText(row.value,x + width,y + 16);
    if (!row.isTotal && index < rows.length - 1) {
      context.strokeStyle = "#e2e5e9";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x,y + layout.height - .5);
      context.lineTo(x + width,y + layout.height - .5);
      context.stroke();
    }
    y += layout.height;
  });
  context.textAlign = "left";
  return y;
}

const directText = element => [...(element?.childNodes || [])]
  .filter(node => node.nodeType === Node.TEXT_NODE)
  .map(node => node.textContent.trim())
  .filter(Boolean)
  .join(" ");

function resultRows(container) {
  return [...(container?.children || [])].filter(element => element.matches("div")).map(element => {
    const label = element.querySelector(":scope > span");
    return {
      label: directText(label),
      note: label?.querySelector("small")?.textContent.trim() || "",
      value: element.querySelector(":scope > b")?.textContent.trim() || "",
      isTotal: element.classList.contains("subtotal") || element.classList.contains("fee-subtotal"),
      isDivider: element.classList.contains("fee-divider")
    };
  });
}

export function currentQuoteImageData() {
  const results = document.querySelector("#quote-results");
  const head = results.querySelector(".quote-result-head > div");
  const paymentPanel = results.querySelector("[data-payment-panel]:not([hidden])");
  const customer = head.querySelector(":scope > small")?.textContent.trim() || "";
  const loanNote = paymentPanel.querySelector(".loan-note");
  return {
    car: head.querySelector("h2").textContent.trim(),
    version: head.querySelector(":scope > p").textContent.trim(),
    customer,
    vehicleRows: resultRows(results.querySelector(".vehicle-cost")),
    paymentLabel: paymentPanel.querySelector(":scope > span").textContent.trim(),
    paymentTotal: paymentPanel.querySelector(":scope > h3").textContent.trim(),
    paymentDescription: paymentPanel.querySelector(":scope > p").textContent.trim(),
    paymentRows: resultRows(paymentPanel.querySelector(".fee-breakdown")),
    loan: loanNote ? {
      label: loanNote.querySelector(":scope > span").textContent.trim(),
      value: loanNote.querySelector(":scope > b").textContent.trim(),
      note: loanNote.querySelector(":scope > small").textContent.trim()
    } : null,
    disclaimer: results.querySelector(".quote-disclaimer").textContent.trim()
  };
}

export function quoteImageUrl(data) {
  const measureCanvas = document.createElement("canvas");
  const measureContext = measureCanvas.getContext("2d");
  const panelWidth = QUOTE_IMAGE_WIDTH - 80;
  const rowWidth = panelWidth - 64;
  const vehicleHeight = 86 + rowsHeight(measureContext,data.vehicleRows,rowWidth - 350);
  const paymentHeight = 174 + rowsHeight(measureContext,data.paymentRows,rowWidth - 350) + (data.loan ? 148 : 0);
  setCanvasFont(measureContext,18,400);
  const disclaimerLines = wrappedLines(measureContext,data.disclaimer,panelWidth - 64);
  setCanvasFont(measureContext,21,600);
  const customerLines = wrappedLines(measureContext,data.customer,QUOTE_IMAGE_WIDTH - 152);
  const headerHeight = 310 + customerLines.length * 32;
  const footerHeight = 112 + disclaimerLines.length * 25;
  const height = 40 + headerHeight + 24 + vehicleHeight + 24 + paymentHeight + 24 + footerHeight + 40;
  const canvas = document.createElement("canvas");
  canvas.width = QUOTE_IMAGE_WIDTH;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Trình duyệt không hỗ trợ tạo ảnh");

  context.textBaseline = "top";
  context.fillStyle = "#f3f6f9";
  context.fillRect(0,0,canvas.width,canvas.height);
  const gradient = context.createLinearGradient(40,40,QUOTE_IMAGE_WIDTH - 40,40 + headerHeight);
  gradient.addColorStop(0,"#0879e8");
  gradient.addColorStop(1,"#0054b4");
  context.fillStyle = gradient;
  roundedRect(context,40,40,panelWidth,headerHeight,30);
  context.fill();

  context.textAlign = "left";
  context.fillStyle = "#ddecff";
  setCanvasFont(context,18,750);
  context.fillText("THỊNH XE ĐIỆN · BÁO GIÁ DỰ KIẾN",76,76);
  context.textAlign = "right";
  setCanvasFont(context,17,600);
  context.fillText(new Intl.DateTimeFormat("vi-VN").format(new Date()),QUOTE_IMAGE_WIDTH - 76,78);
  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  setCanvasFont(context,58,750);
  context.fillText(data.car,76,126);
  context.fillStyle = "#ddecff";
  setCanvasFont(context,25,500);
  context.fillText(data.version,76,199);
  let headerLine = 241;
  if (data.customer) {
    context.fillStyle = "#ffffff";
    setCanvasFont(context,21,600);
    customerLines.forEach((line,index) => context.fillText(line,76,headerLine + index * 32));
    headerLine += customerLines.length * 32 + 10;
  }
  context.strokeStyle = "#ffffff42";
  context.beginPath();
  context.moveTo(76,headerLine);
  context.lineTo(QUOTE_IMAGE_WIDTH - 76,headerLine);
  context.stroke();
  context.fillStyle = "#ddecff";
  setCanvasFont(context,17,500);
  context.fillText("TƯ VẤN BÁN HÀNG",76,headerLine + 21);
  context.fillStyle = "#ffffff";
  setCanvasFont(context,22,750);
  context.fillText(`${SALES_ADVISOR} · ${SALES_PHONE}`,270,headerLine + 17);

  let y = 40 + headerHeight + 24;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dfe3e8";
  context.lineWidth = 1;
  roundedRect(context,40,y,panelWidth,vehicleHeight,25);
  context.fill();
  context.stroke();
  context.fillStyle = "#0879e8";
  setCanvasFont(context,19,750);
  context.fillText("GIÁ TRỊ XE",72,y + 30);
  drawRows(context,data.vehicleRows,72,y + 72,rowWidth);

  y += vehicleHeight + 24;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dfe3e8";
  roundedRect(context,40,y,panelWidth,paymentHeight,25);
  context.fill();
  context.stroke();
  context.fillStyle = "#0879e8";
  setCanvasFont(context,19,750);
  context.fillText(data.paymentLabel,72,y + 30);
  context.fillStyle = "#1d1d1f";
  setCanvasFont(context,45,750);
  context.fillText(data.paymentTotal,72,y + 64);
  context.fillStyle = "#6e6e73";
  setCanvasFont(context,18,400);
  context.fillText(data.paymentDescription,72,y + 121);
  let paymentY = drawRows(context,data.paymentRows,72,y + 158,rowWidth);
  if (data.loan) {
    context.fillStyle = "#edf6ff";
    roundedRect(context,64,paymentY + 12,panelWidth - 48,120,18);
    context.fill();
    context.fillStyle = "#6e6e73";
    setCanvasFont(context,17,600);
    context.fillText(data.loan.label,88,paymentY + 33);
    context.fillStyle = "#0879e8";
    setCanvasFont(context,29,750);
    context.fillText(data.loan.value,88,paymentY + 59);
    context.textAlign = "right";
    context.fillStyle = "#6e6e73";
    setCanvasFont(context,16,400);
    context.fillText(data.loan.note,QUOTE_IMAGE_WIDTH - 88,paymentY + 67);
    context.textAlign = "left";
  }

  y += paymentHeight + 24;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dfe3e8";
  roundedRect(context,40,y,panelWidth,footerHeight,25);
  context.fill();
  context.stroke();
  context.fillStyle = "#0879e8";
  setCanvasFont(context,18,750);
  context.fillText("LƯU Ý",72,y + 28);
  context.fillStyle = "#6e6e73";
  setCanvasFont(context,18,400);
  disclaimerLines.forEach((line,index) => context.fillText(line,72,y + 61 + index * 25));
  context.fillStyle = "#1d1d1f";
  setCanvasFont(context,17,700);
  context.fillText("VinFast Bình Thủy Thủ Dầu Một · 645 Đại lộ Bình Dương",72,y + footerHeight - 34);

  return canvas.toDataURL("image/png");
}

export function downloadQuoteImage(car, paymentMode) {
  const button = document.querySelector("#download-quote-image");
  const status = document.querySelector("#quote-export-status");
  button.disabled = true;
  button.textContent = "Đang tạo ảnh...";
  status.textContent = "";
  try {
    const link = document.createElement("a");
    const customerName = document.querySelector("#customer-name")?.value.trim() || "";
    const customerPhone = document.querySelector("#customer-phone")?.value.trim() || "";
    link.href = quoteImageUrl(currentQuoteImageData());
    link.download = quoteImageFileName(car,paymentMode,{ customerName,customerPhone });
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    status.textContent = "Đã tải ảnh PNG.";
  } catch (error) {
    console.error(error);
    status.textContent = "Không thể tạo ảnh. Vui lòng thử lại.";
  } finally {
    button.disabled = false;
    button.textContent = "Tải ảnh báo giá";
  }
}
