const WIDTH = 1400;
export const LOAN_IMAGE_ROWS = 36;
const number = value => new Intl.NumberFormat('vi-VN').format(Math.round(value));
const percent = value => new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(value);
const dateKey = date => [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');

// Fixed-size pages keep every month readable and stay below mobile canvas limits.
export async function createLoanScheduleImages(plan, date = new Date()) {
  const {principal,annualRate,floatingAnnualRate,months,fixedMonths,schedule} = plan;
  const count = Math.ceil(schedule.rows.length / LOAN_IMAGE_ROWS);
  const pages = [];
  for (let index=0;index<count;index++) {
    const rows = schedule.rows.slice(index*LOAN_IMAGE_ROWS,(index+1)*LOAN_IMAGE_ROWS);
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = 610 + rows.length * 46;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Trình duyệt không hỗ trợ tạo ảnh.');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,WIDTH,canvas.height);
    ctx.textBaseline='top';
    const text = (value,x,y,size=22,color='#1d2939',weight=500,align='left',maxWidth) => {
      ctx.font=`${weight} ${size}px Arial,sans-serif`; ctx.fillStyle=color; ctx.textAlign=align;
      if (maxWidth) ctx.fillText(String(value),x,y,maxWidth); else ctx.fillText(String(value),x,y);
    };
    ctx.fillStyle='#0c54cf'; ctx.fillRect(0,0,WIDTH,125);
    text('THỊNH XE ĐIỆN · KẾ HOẠCH TRẢ NỢ',44,26,32,'#fff',700);
    text(`Ngày lập ${new Intl.DateTimeFormat('vi-VN').format(date)} · Ảnh ${index+1}/${count} · Tháng ${rows[0].month}–${rows.at(-1).month}`,44,78,21,'#e6efff');
    text(`Khoản vay: ${number(principal)} đ`,44,151,27,'#172b4d',700);
    text(`Thời hạn: ${months} tháng · Gốc chia đều: ${number(schedule.regularPrincipal)} đ/tháng`,44,192,22);
    text(`Ưu đãi: ${percent(annualRate)}%/năm trong ${fixedMonths} tháng · Thả nổi giả định: ${percent(floatingAnnualRate)}%/năm`,44,228,22);
    const summaries = [
      ['Kỳ đầu ưu đãi',fixedMonths ? `${number(schedule.introductoryFirstPayment)} đ` : 'Không áp dụng'],
      ['Kỳ đầu thả nổi',schedule.floatingFirstPayment===null ? 'Không áp dụng' : `${number(schedule.floatingFirstPayment)} đ`]
    ];
    summaries.forEach(([label,value],i)=>{
      const x=44+i*667; ctx.fillStyle='#edf4ff'; ctx.fillRect(x,277,645,86);
      text(label,x+16,290,20,'#51647d'); text(value,x+16,322,26,'#084ec0',700,'left',613);
    });
    text(`Tổng gốc: ${number(principal)} đ  ·  Tổng lãi: ${number(schedule.totalInterest)} đ  ·  Tổng trả: ${number(schedule.totalPayment)} đ`,44,387,22,'#172b4d',700,'left',1312);
    const columns = [
      ['Kỳ',44,100],['Lãi/năm',144,145],['Dư nợ đầu kỳ',289,238],['Gốc',527,200],['Lãi',727,190],['Thanh toán',917,220],['Dư nợ cuối kỳ',1137,219]
    ];
    ctx.fillStyle='#132b4a'; ctx.fillRect(44,436,1312,48);
    columns.forEach(([label,x,width])=>text(label,x+width-10,451,19,'#fff',700,'right'));
    let y=484;
    rows.forEach(row=>{
      ctx.fillStyle=row.month===fixedMonths+1 ? '#dceaff' : row.month%2 ? '#f5f7fa' : '#fff';
      ctx.fillRect(44,y,1312,46);
      const values=[row.month,`${percent(row.appliedAnnualRate)}%`,number(row.openingBalance),number(row.principalPayment),number(row.interest),number(row.payment),number(row.balance)];
      columns.forEach(([,x,width],i)=>text(values[i],x+width-10,y+13,19,'#26364a',i===5 ? 700 : 500,'right',width-18));
      y+=46;
    });
    text('Tham khảo, không phải cam kết cấp tín dụng. Lãi kỳ = dư nợ đầu kỳ × lãi suất năm / 12.',44,y+24,19,'#51647d');
    text('Lãi thả nổi giả định; thực tế phụ thuộc ngân hàng, ngày giải ngân, phí và cách làm tròn.',44,y+53,19,'#51647d');
    text('Các số hiển thị làm tròn độc lập đến đồng. Đơn vị tiền trong bảng: đồng.',44,y+82,19,'#51647d');
    const blob = await new Promise((resolve,reject)=>canvas.toBlob(value=>value ? resolve(value) : reject(new Error('Không thể tạo PNG.')),'image/png'));
    pages.push({blob,fileName:`Lich-tra-no-VinFast-${principal}VND-${months}thang-${dateKey(date)}-${String(index+1).padStart(2,'0')}.png`,startMonth:rows[0].month,endMonth:rows.at(-1).month});
    canvas.width=0; canvas.height=0;
  }
  return pages;
}
