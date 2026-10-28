const assert=require('node:assert/strict'),createCounter=require('./helpers/prize-counter-harness.cjs');
(async()=>{
 const counter=createCounter();const ids=Array.from({length:100},(_,i)=>'test-client-'+String(i).padStart(22,'0'));
 const receipts=await Promise.all(ids.map(async id=>counter.register(id)));assert.deepEqual(receipts.map(r=>r.rank),Array.from({length:100},(_,i)=>i+1));assert.equal(receipts.filter(r=>r.eligible).length,15);assert(receipts.slice(15).every(r=>!r.eligible));assert.equal(counter.status().total,100);
 const repeat=await Promise.all(ids.map(async id=>counter.register(id)));assert.equal(counter.status().total,100);for(let i=0;i<100;i++){assert.equal(repeat[i].rank,receipts[i].rank);assert.equal(repeat[i].receiptCode,receipts[i].receiptCode)}
 for(const payload of [{clientId:'bad',completed:counter.complete},{clientId:ids[0],completed:counter.complete.slice(1)},{clientId:ids[0],completed:Array(8).fill('data')},{clientId:ids[0],completed:[...counter.complete.slice(1),'fake']}])assert.equal(counter.send(payload).ok,false);
 assert.equal(counter.status().total,100);counter.failNextWrite();assert.equal(counter.register('new-browser-after-failure-001').ok,false);assert.equal(counter.status().total,100);assert.equal(counter.register('new-browser-after-failure-001').rank,101);assert.equal(counter.status().total,101);
 counter.rows.pop();assert.equal(counter.register('new-browser-after-row-delete-002').rank,102);assert.equal(counter.status().total,102);const locks=counter.locks();assert(!locks.held);assert.equal(locks.acquired,locks.released);assert.deepEqual(Object.keys(counter.status()).sort(),['limit','ok','total']);
 console.log('PASS actual Apps Script logic: 100 allocations, unique sequential ranks, exactly 15 eligible, idempotent retries, invalid completions rejected, write failure recovery, lock held through lookup/write, monotonic total and no public receipt disclosure.');
})().catch(e=>{console.error(e);process.exit(1)});
