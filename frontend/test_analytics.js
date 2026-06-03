const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  const allTeams = await prisma.team.findMany({ 
    where: { 
      OR: [ { status: { not: 'PENDING' } }, { payment: { status: 'SUCCESS' } } ] 
    }, 
    select: { createdAt: true } 
  }); 
  const allPayments = await prisma.payment.findMany({ 
    where: { status: 'SUCCESS' }, 
    select: { amount: true, createdAt: true } 
  }); 
  const teamDates = allTeams.map(t => new Date(t.createdAt).getTime()); 
  const paymentDates = allPayments.map(p => new Date(p.createdAt).getTime()); 
  
  // LOG the dates to see if array has NaN or Infinity!
  console.log("teamDates:", teamDates);
  console.log("paymentDates:", paymentDates);
  
  let earliestTime = Math.min(...teamDates, ...paymentDates, Date.now()); 
  
  // Wait, if teamDates is empty, Math.min() on empty array is Infinity!
  // If paymentDates is empty, Math.min() on empty is Infinity!
  // Date.now() is a number.
  // Wait! Math.min(...teamDates) returns Infinity if teamDates is empty.
  // But wait, there is ONE team.
  console.log("earliestTime:", earliestTime);
  
  const earliestDate = new Date(earliestTime); 
  earliestDate.setHours(0, 0, 0, 0); 
  
  const today = new Date(); 
  today.setHours(0, 0, 0, 0); 
  
  const allDays = []; 
  for (let d = new Date(earliestDate); d <= today; d.setDate(d.getDate() + 1)) { 
    allDays.push(new Date(d)); 
  } 
  
  const dailyRegistrations = allDays.map(date => { 
    const count = allTeams.filter(t => { 
      const d = new Date(t.createdAt); 
      return d.toDateString() === date.toDateString(); 
    }).length; 
    return { 
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      _count: count 
    }; 
  }); 
  console.log(dailyRegistrations); 
} 
main().finally(() => prisma.$disconnect());
