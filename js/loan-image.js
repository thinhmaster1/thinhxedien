const number=value=>new Intl.NumberFormat('vi-VN').format(Math.round(value));
const rate=value=>new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(value);
const day=date=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');

// One compact image; the full monthly schedule remains available on the page.
export async function createLoanImages(plan,date=new Date()) {
  const {principal,annualRate,floatingAnnualRate,months,fixedMonths,schedule}=plan;
  const canvas=document.createElement('canvas'); canvas.width=1080; canvas.height=1040;
  const ctx=canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể tạo ảnh.');
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,1080,1120); ctx.textBaseline='top';
  const text=(value,x,y,size=26,color='#172b4d',weight=400,align='left',width=984)=>{
    ctx.font=`${weight} ${size}px Arial,sans-serif`; ctx.fillStyle=color; ctx.textAlign=align; ctx.fillText(String(value),x,y,width);
  };
  ctx.fillStyle='#0c54cf';ctx.fillRect(0,0,1080,134);
  text('THỊNH XE ĐIỆN · TÓM TẮT KHOẢN VAY',48,30,34,'#fff',700);
  text(`Ngày lập ${new Intl.DateTimeFormat('vi-VN').format(date)} · Dư nợ giảm dần`,48,86,23,'#e5efff');
  text(`Số tiền vay: ${number(principal)} đ`,48,170,34,'#172b4d',700);
  text(`Thời hạn: ${months} tháng (${months/12} năm)`,48,222);
  text(fixedMonths ? `Ưu đãi: ${rate(annualRate)}%/năm trong ${fixedMonths} tháng` : 'Không có giai đoạn ưu đãi',48,268);
  text(fixedMonths<months ? `Thả nổi giả định: ${rate(floatingAnnualRate)}%/năm từ tháng ${fixedMonths+1}` : 'Không áp dụng lãi thả nổi',48,314);
  const rows=[
    ['Trả kỳ đầu ưu đãi',fixedMonths ? `${number(schedule.introductoryFirstPayment)} đ` : 'Không áp dụng'],
    ['Trả kỳ đầu thả nổi',schedule.floatingFirstPayment===null ? 'Không áp dụng' : `${number(schedule.floatingFirstPayment)} đ`],
    ['Gốc trả mỗi tháng',`${number(schedule.regularPrincipal)} đ`],
    ['Tổng tiền lãi',`${number(schedule.totalInterest)} đ`],
    ['Tổng gốc + lãi',`${number(schedule.totalPayment)} đ`]
  ];
  rows.forEach(([label,value],index)=>{
    const y=386+index*82;
    ctx.fillStyle=index===4 ? '#edf4ff' : index%2 ? '#f7f9fc' : '#fff';
    ctx.fillRect(32,y-14,1016,78);
    text(label,48,y+7,25,'#51647d',400,'left',450);
    text(value,1032,y+7,30,index===4 ? '#084ec0' : '#172b4d',700,'right',480);
  });
  text('Khoản trả thay đổi theo từng tháng; các mức trên là kỳ đầu mỗi giai đoạn.',48,820,22,'#51647d');
  text('Lãi = dư nợ đầu kỳ × lãi suất năm / 12. Gốc chia đều theo thời hạn.',48,863,22,'#51647d');
  text('Chỉ tham khảo, không phải cam kết ngân hàng. Chưa bao gồm phí.',48,906,22,'#51647d');
  text('Lãi thả nổi thực tế và cách tính có thể thay đổi. Số tiền làm tròn đến đồng.',48,949,22,'#51647d');
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value ? resolve(value) : reject(new Error('Không thể tạo PNG.')),'image/png'));
  return [{blob,fileName:`Tom-tat-khoan-vay-VinFast-${principal}VND-${months}thang-${day(date)}.png`}];
}
