let bookings = [];
    let currentIndex = null;

    function showSection(id, el) {
      document.querySelectorAll('main section').forEach(s=>s.classList.add('hidden'));
      document.getElementById(id).classList.remove('hidden');
      document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));
      if(el) el.classList.add('active');
    }

    function startBooking(bus) {
      document.getElementById('buses').classList.add('hidden');
      showSection('booking', document.querySelectorAll('.sidebar a')[1]);
      document.getElementById('busNumber').value = bus;
    }

    function addPassenger() {
      const c=document.getElementById('passengerFields');
      c.insertAdjacentHTML('beforeend', `<div class="form-group"><label>Passenger Name:</label><input type="text" class="form-control passenger-input" required></div>`);
      document.getElementById('seats').value=c.querySelectorAll('.passenger-input').length;
    }

    function submitBooking(e) {
      e.preventDefault();
      const names=[...document.querySelectorAll('.passenger-input')].map(i=>i.value).join(', ');
      const bus=document.getElementById('busNumber').value;
      const seats=+document.getElementById('seats').value;
      const total=seats*250;const final=(total*1.12).toFixed(2);
      const ticket={names,bus,seats,final,cancelled:false};
      bookings.push(ticket);
      currentIndex=bookings.length-1;
      renderTicket(ticket);
      updateHistory();
      showSection('ticket', document.querySelectorAll('.sidebar a')[2]);
    }

    function renderTicket(t) {
      document.getElementById('ticketDetails').innerHTML=`
        <p><strong>Passengers:</strong> ${t.names}</p>
        <p><strong>Bus Number:</strong> ${t.bus}</p>
        <p><strong>Seats:</strong> ${t.seats}</p>
        <p><strong>Total Paid:</strong> ₹${t.final}</p>
        <p><strong>Status:</strong> ${t.cancelled?'<span class="text-danger">Cancelled</span>':'Active'}</p>`;
    }

    function cancelCurrent() {
      if(currentIndex===null) return;
      if(!confirm('Cancel this ticket?')) return;
      bookings[currentIndex].cancelled=true;
      renderTicket(bookings[currentIndex]);
      updateHistory();
    }

    function updateHistory() {
      const tb=document.querySelector('#historyTable tbody');tb.innerHTML='';
      bookings.forEach((t,i)=>{
        tb.insertAdjacentHTML('beforeend',`<tr>
          <td>${t.names}</td>
          <td>${t.bus}</td>
          <td>${t.seats}</td>
          <td>₹${t.final}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="downloadHistoryPDF(${i})">PDF</button>
            <button class="btn btn-sm btn-danger" onclick="cancelHistory(${i})" ${t.cancelled?'disabled':''}>Cancel</button>
          </td>
        </tr>`);
      });
    }

    function cancelHistory(i) {
      if(!confirm('Cancel this ticket?')) return;
      bookings[i].cancelled=true;
      updateHistory();
      if(currentIndex===i) renderTicket(bookings[i]);
    }

    function downloadPDF() {
      const { jsPDF } = window.jspdf;const doc=new jsPDF();const t=bookings[currentIndex];
      doc.text('Bus Ticket',20,20);doc.text(`Passengers: ${t.names}`,20,30);
      doc.text(`Bus Number: ${t.bus}`,20,40);doc.text(`Seats: ${t.seats}`,20,50);
      doc.text(`Total Paid: ₹${t.final}`,20,60);doc.text(`Status: ${t.cancelled?'Cancelled':'Active'}`,20,70);
      doc.save(`ticket_${currentIndex}.pdf`);
    }

    function downloadHistoryPDF(i) {
      currentIndex=i;downloadPDF();
    }