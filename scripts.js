function initMap() {
    if (!document.getElementById('map')) return; 

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.3193, lng: 114.1694 }, // Hong Kong
        zoom: 12
    });

    // Feature 1: Multiple markers
    const locations = [
        { lat: 22.2795, lng: 114.1588, title: 'Victoria Peak', description: 'Stunning views of Hong Kong.' },
        { lat: 22.3230, lng: 114.1737, title: 'Kowloon Park', description: 'A peaceful urban park.' },
        { lat: 22.2950, lng: 114.1720, title: 'Tsim Sha Tsui', description: 'Vibrant shopping and dining area.' }
    ];

    // Feature 2: Info windows
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<h3>${location.title}</h3><p>${location.description}</p>`
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });

    // Feature 3: Custom reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Map';
    resetButton.style.padding = '10px';
    resetButton.style.margin = '10px';
    resetButton.style.backgroundColor = '#cc6600';
    resetButton.style.color = '#fff';
    resetButton.style.border = 'none';
    resetButton.style.cursor = 'pointer';

    resetButton.addEventListener('click', () => {
        map.setCenter({ lat: 22.3193, lng: 114.1694 });
        map.setZoom(12);
    });

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(resetButton);
}

// Ensure initMap is globally accessible
window.initMap = initMap;

// script
        var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }
// script