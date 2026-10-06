const C=[
{t:"주택 매매 자금계획",f:[["price","집값","50000","만원"],["cash","보유 현금","7000","만원"],["loan","대출금","35000","만원"],["extra","취득·부대비용","1500","만원"]],fn:v=>`추가 필요 현금 <span class="big">${money(Math.max(0,v.price+v.extra-v.cash-v.loan))}</span><br><small>집값 + 취득·부대비용 − 보유 현금 − 대출금</small>`},
{t:"취득세",f:[["price","주택 가격","50000","만원"],["rate","취득세율","1","%"]],fn:v=>`예상 취득세 <span class="big">${money(v.price*v.rate/100)}</span><br><small>취득세율을 직접 입력하는 단순 계산입니다. 실제 세액은 주택 수·가격·지역·감면 여부 등에 따라 달라질 수 있습니다.</small>`},
{t:"전세자금",f:[["deposit","전세보증금","30000","만원"],["loan","전세대출","24000","만원"],["rate","연 금리","3.5","%"]],fn:v=>`필요 자기자금 <span class="big">${money(Math.max(0,v.deposit-v.loan))}</span><br>월 예상 이자 <span class="big">${money(v.loan*v.rate/100/12)}</span>`},
{t:"LTV",f:[["price","주택 가격","50000","만원"],["ltv","LTV","70","%"]],fn:v=>`LTV 기준 대출한도 <span class="big">${money(v.price*v.ltv/100)}</span>`},
{t:"DTI",f:[["income","연소득","3600","만원"],["housing","연간 주택대출 원리금","900","만원"],["other","연간 기타 부채상환액","100","만원"]],fn:v=>`예상 DTI <span class="big">${percent((v.housing+v.other)/v.income*100)}</span>`},
{t:"DSR",f:[["income","연소득","3600","만원"],["annual","연간 총 원리금","900","만원"]],fn:v=>`예상 DSR <span class="big">${percent(v.annual/v.income*100)}</span><br><small>모든 대출의 연간 원리금 ÷ 연소득</small>`},
{t:"중개보수",f:[["amount","거래금액","50000","만원"],["rate","중개보수율","0.4","%"]],fn:v=>`예상 중개보수 <span class="big">${money(v.amount*v.rate/100)}</span><br><small>실제 법정 상한요율은 거래 유형·금액 등에 따라 달라질 수 있습니다.</small>`},
{t:"재산세",f:[["base","과세표준","20000","만원"],["rate","재산세율","0.1","%"]],fn:v=>`예상 재산세 <span class="big">${money(v.base*v.rate/100)}</span><br><small>단순 계산이며 지방교육세·도시지역분 등은 별도입니다.</small>`},
{t:"청약 자금계획",f:[["price","분양가","50000","만원"],["contract","계약금","10","%"],["middle","중도금","60","%"],["balance","잔금","30","%"]],fn:v=>`계약금 <span class="big">${money(v.price*v.contract/100)}</span><br>중도금 ${money(v.price*v.middle/100)}<br>잔금 ${money(v.price*v.balance/100)}<br><small>입력한 비율 합계: ${percent(v.contract+v.middle+v.balance)}</small>`},
{t:"월 상환금",f:[["loan","대출금","30000","만원"],["rate","연 금리","4","%"],["years","대출기간","30","년"]],fn:v=>{const P=v.loan*10000,r=v.rate/100/12,n=v.years*12,m=r?P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):P/n;return`월 상환액 <span class="big">${money(m/10000)}</span><br>총 상환액 ${money(m*n/10000)}<br>총 이자 ${money((m*n-P)/10000)}`}}
];

let cur=0;
function money(n){return `${Math.round(n).toLocaleString("ko-KR")}만원`}
function percent(n){return `${Number(n).toFixed(1)}%`}
function fmt(v){return v===""?"":Number(v.replace(/,/g,"")).toLocaleString("ko-KR")}
function openCalc(i){
 cur=i;const c=C[i];document.getElementById("modalNum").textContent=String(i+1).padStart(2,"0");
 document.getElementById("modalTitle").textContent=c.t;
 document.getElementById("form").innerHTML=c.f.map(x=>`<div class="field"><label>${x[1]}</label><div class="input-wrap"><input id="v_${x[0]}" inputmode="decimal" value="${fmt(x[2])}" data-unit="${x[3]}" oninput="formatInput(this)"><span class="unit">${x[3]}</span></div></div>`).join("");
 document.getElementById("result").innerHTML="입력값을 확인하고 계산해 주세요.";
 document.getElementById("modal").classList.add("show");document.body.style.overflow="hidden";
}
function formatInput(el){let raw=el.value.replace(/[^\d.]/g,"");let parts=raw.split(".");if(parts.length>2)raw=parts[0]+"."+parts.slice(1).join("");let a=parts[0]||"";let b=parts[1]!==undefined?"."+parts[1]:"";el.value=(a?Number(a).toLocaleString("ko-KR"):"")+b}
function calculate(){
 const vals={};C[cur].f.forEach(x=>vals[x[0]]=Number(document.getElementById("v_"+x[0]).value.replace(/,/g,""))||0);
 document.getElementById("result").innerHTML=C[cur].fn(vals);
}
function closeCalc(){document.getElementById("modal").classList.remove("show");document.body.style.overflow=""}
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")closeCalc()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCalc()});
