document.addEventListener("DOMContentLoaded", () => {
    const rubricForm = document.getElementById('rubric-form');
    const transcriptContent = document.getElementById('transcript-content');
    const videoPlayer = document.getElementById('video-player');
  
    // Directory paths
    const videoDirectory = '/videos/';
    const transcriptDirectory = '/transcripts/';
    const csvFilePath = '/csv/data.csv';
  
    // Set total number of files
    const totalFiles = 10; // Change based on actual number of files
    let currentFileIndex = 1;
    let csvData = [];
  
    // Load the first video and transcript on page load
    loadVideoAndTranscript(currentFileIndex);
  
    // Load CSV data using Papa Parse
    fetch(csvFilePath)
      .then(response => response.text())
      .then(data => {
        csvData = Papa.parse(data, { header: true }).data;
        loadRubric(csvData);
      });
  
    // Function to load rubric from CSV columns 2 to 44
    function loadRubric(data) {
      const columns = Object.keys(data[0]).slice(1, 44); // Columns from 2 to 44
      rubricForm.innerHTML = ''; // Clear form
      columns.forEach(column => {
        const label = document.createElement('label');
        label.textContent = column;
        const select = document.createElement('select');
        for (let i = 0; i <= 5; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          select.appendChild(option);
        }
        rubricForm.appendChild(label);
        rubricForm.appendChild(select);
        rubricForm.appendChild(document.createElement('br'));
      });
    }
  
    // Load the next video and transcript
    function loadNextVideo() {
      currentFileIndex++;
      if (currentFileIndex > totalFiles) {
        alert("All videos graded! You can now download the updated CSV.");
        downloadCSV();
        return;
      }
      loadVideoAndTranscript(currentFileIndex);
    }
  
    // Function to load video and transcript based on current index
    function loadVideoAndTranscript(index) {
      const videoUrl = `${videoDirectory}video${index}.mp4`;
      const transcriptUrl = `${transcriptDirectory}transcript${index}.txt`;
  
      videoPlayer.src = videoUrl;
  
      fetch(transcriptUrl)
        .then(response => response.text())
        .then(data => {
          transcriptContent.textContent = data;
        })
        .catch(error => {
          console.error('Error loading transcript:', error);
          transcriptContent.textContent = "Transcript not available.";
        });
    }
  
    // Submit grades and move to the next video
    function submitGrades() {
      const rubricValues = [];
      const selects = document.querySelectorAll('#rubric-form select');
      selects.forEach(select => rubricValues.push(select.value));
  
      // Update CSV data
      csvData[currentFileIndex - 1] = { ...csvData[currentFileIndex - 1], ...rubricValues };
  
      // Load next video
      loadNextVideo();
    }
  
    // Function to download the updated CSV file
    function downloadCSV() {
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "updated_data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  
    // Attach submitGrades to button
    document.querySelector('button').addEventListener('click', submitGrades);
  });
  