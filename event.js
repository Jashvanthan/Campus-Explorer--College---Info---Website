const ADMIN_PASSWORD = "sjce"; // Admin password
    const addEventBtn = document.getElementById("addEventBtn");
    const eventForm = document.getElementById("eventForm");
    const submitEvent = document.getElementById("submitEvent");
    const closeForm = document.getElementById("closeForm");
    const eventContainer = document.getElementById("eventContainer");
    const loginMsg = document.getElementById("loginMsg");
    const filterSelect = document.getElementById("filterSelect");
    const formTitle = document.getElementById("formTitle");

    let events = [];
    let editIndex = -1; // Track which event is being edited

    addEventBtn.onclick = () => {
      formTitle.textContent = "Add New Event (Admin)";
      editIndex = -1;
      eventForm.style.display = "block";
      clearForm();
    };

    closeForm.onclick = () => {
      eventForm.style.display = "none";
      loginMsg.textContent = "";
    };

    submitEvent.onclick = () => {
      const password = document.getElementById("adminPassword").value.trim();
      if(password !== ADMIN_PASSWORD){
        loginMsg.textContent = "Incorrect password!";
        return;
      }
      loginMsg.textContent = "";

      const eventName = document.getElementById("eventName").value.trim();
      const orgName = document.getElementById("orgName").value.trim();
      const venue = document.getElementById("venue").value.trim();
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const duration = document.getElementById("duration").value;
      const type = document.getElementById("eventType").value;
      const imageInput = document.getElementById("eventImage");

      if(!eventName || !orgName || !venue || !date || !time || !duration){
        alert("Please fill all fields!");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result; // base64 string
        const event = { name: eventName, org: orgName, venue, date, time, duration, type, image: imageData };

        if(editIndex === -1){
          // Add new
          events.push(event);
        } else {
          // Update existing
          events[editIndex] = event;
        }

        displayEvents();
        eventForm.style.display = "none";
        clearForm();
      };

      if(imageInput.files[0]){
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        reader.onload(); // no image
      }
    };

    function clearForm(){
      document.getElementById("adminPassword").value = "";
      document.getElementById("eventName").value = "";
      document.getElementById("orgName").value = "";
      document.getElementById("venue").value = "";
      document.getElementById("date").value = "";
      document.getElementById("time").value = "";
      document.getElementById("duration").value = "";
      document.getElementById("eventImage").value = "";
      document.getElementById("eventType").value = "College Event";
    }

    function displayEvents(){
      const selectedType = filterSelect.value;
      let filteredEvents = events;
      if(selectedType !== "All"){
        filteredEvents = events.filter(e => e.type === selectedType);
      }

      eventContainer.innerHTML = filteredEvents.map((e, index) => `
        <div class="event-item">
          ${e.image ? `<img src="${e.image}" alt="Event Image">` : ''}
          <h3>${e.name}</h3>
          <p><strong>Organization:</strong> ${e.org}</p>
          <p><strong>Venue:</strong> ${e.venue}</p>
          <p><strong>Date:</strong> ${e.date}</p>
          <p><strong>Time:</strong> ${e.time}</p>
          <p><strong>Duration:</strong> ${e.duration}</p>
          <p><strong>Type:</strong> ${e.type}</p>
          <div class="event-buttons">
            <button onclick="editEvent(${index})">Update</button>
            <button onclick="deleteEvent(${index})">Delete</button>
          </div>
        </div>
      `).join("");
    }

    window.editEvent = (index) => {
      const password = prompt("Enter admin password to update this event:");
      if(password !== ADMIN_PASSWORD){
        alert("Incorrect password!");
        return;
      }

      const e = events[index];
      document.getElementById("eventName").value = e.name;
      document.getElementById("orgName").value = e.org;
      document.getElementById("venue").value = e.venue;
      document.getElementById("date").value = e.date;
      document.getElementById("time").value = e.time;
      document.getElementById("duration").value = e.duration;
      document.getElementById("eventType").value = e.type;

      formTitle.textContent = "Update Event (Admin)";
      editIndex = index;
      eventForm.style.display = "block";
    };

    window.deleteEvent = (index) => {
      const password = prompt("Enter admin password to delete this event:");
      if(password !== ADMIN_PASSWORD){
        alert("Incorrect password!");
        return;
      }

      if(confirm("Are you sure you want to delete this event?")){
        events.splice(index, 1);
        displayEvents();
      }
    };

    filterSelect.onchange = displayEvents;