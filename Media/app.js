(function () {
    const DELIMITER = ',';
    const NEWLINE = '\n';

    const fileInput = document.getElementById('file');
    const table = document.getElementById('table');
    const columnDropdown = document.getElementById('columnDropdown');
    const filterDropdown = document.getElementById('filterDropdown');
    const randomButton = document.getElementById('randomButton');
    const randomStudentDiv = document.getElementById('randomStudent');

    let parsedRows = [];
    let headers = [];

    if (!fileInput) {
        return;
    }

    fileInput.addEventListener('change', function () {
        if (!!fileInput.files && fileInput.files.length > 0) {
            console.log("File selected:", fileInput.files[0]);
            parseCSV(fileInput.files[0]);
        }
    });

    function parseCSV(file) {
        if (!file || !FileReader) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            console.log("File read successfully");
            toTable(e.target.result);
        };
        reader.onerror = function () {
            console.error("Error reading file");
        };
        reader.readAsText(file);
    }

    function toTable(text) {
        if (!text || !table) {
            console.error("No text or table element");
            return;
        }

        // Clear previous table and dropdown options
        while (table.lastElementChild) {
            table.removeChild(table.lastElementChild);
        }
        columnDropdown.innerHTML = '<option value="">Select a Column</option>';
        filterDropdown.innerHTML = '<option value="">Select a Filter</option>';
        randomStudentDiv.textContent = ''; // Clear previous random student result

        parsedRows = text.split(NEWLINE);
        headers = parsedRows.shift().trim().split(DELIMITER);

        if (headers.length === 0) {
            console.error("No headers found");
            return;
        }

        headers.forEach(function (header) {
            const option = document.createElement('option');
            const headerText = header.trim();
            if (!headerText) {
                return;
            }

            option.value = headerText;
            option.textContent = headerText;
            columnDropdown.appendChild(option);
        });

        // Listen to column selection to update the filter dropdown
        columnDropdown.addEventListener('change', function () {
            filterDropdown.innerHTML = '<option value="">Select a Value</option>';
            const selectedColumn = columnDropdown.value;
            if (selectedColumn) {
                populateFilterDropdown(selectedColumn);
            }
        });

        // Initial table population (before any filtering)
        createTableHeaders(headers);
        populateTable(parsedRows);
    }

    function createTableHeaders(headers) {
        const headerRow = document.createElement('tr');
        headers.forEach(function (header) {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
    }

    function populateTable(rows) {
        rows.forEach(function (row) {
            row = row.trim();
            if (!row) {
                return;
            }

            const cols = row.split(DELIMITER);
            if (cols.length === 0) {
                return;
            }

            const rowElement = document.createElement('tr');
            cols.forEach(function (col) {
                const td = document.createElement('td');
                td.textContent = col.trim();
                rowElement.appendChild(td);
            });
            table.appendChild(rowElement);
        });
    }

    function populateFilterDropdown(selectedColumn) {
        const columnIndex = headers.indexOf(selectedColumn);
        if (columnIndex === -1) {
            return;
        }

        const uniqueValues = new Set();
        parsedRows.forEach(function (row) {
            const cols = row.split(DELIMITER);
            const cellValue = cols[columnIndex]?.trim();
            if (cellValue) {
                uniqueValues.add(cellValue);
            }
        });

        uniqueValues.forEach(function (value) {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            filterDropdown.appendChild(option);
        });

        // Filter table based on selected filter value
        filterDropdown.addEventListener('change', function () {
            const filterValue = filterDropdown.value;
            if (filterValue) {
                filterTable(columnIndex, filterValue);
            }
        });
    }

    function filterTable(columnIndex, filterValue) {
        while (table.lastElementChild) {
            table.removeChild(table.lastElementChild);
        }
        createTableHeaders(headers);

        parsedRows.forEach(function (row) {
            const cols = row.split(DELIMITER);
            if (cols[columnIndex]?.trim() === filterValue) {
                const rowElement = document.createElement('tr');
                cols.forEach(function (col) {
                    const td = document.createElement('td');
                    td.textContent = col.trim();
                    rowElement.appendChild(td);
                });
                table.appendChild(rowElement);
            }
        });
    }

    randomButton.addEventListener('click', function () {
        const selectedColumn = columnDropdown.value;
        const filterValue = filterDropdown.value;

        if (!selectedColumn || !filterValue) {
            randomStudentDiv.textContent = "Please select both a column and filter value.";
            return;
        }

        const columnIndex = headers.indexOf(selectedColumn);
        const filteredRows = [];

        parsedRows.forEach(function (row) {
            const cols = row.split(DELIMITER);
            if (cols[columnIndex]?.trim() === filterValue) {
                filteredRows.push(cols);
            }
        });

        if (filteredRows.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredRows.length);
            const randomRow = filteredRows[randomIndex];
            const randomStudent = randomRow.join(' ');

            randomStudentDiv.textContent = "Randomly selected student: " + randomStudent;
            alert("Randomly selected student: " + randomStudent);
        } else {
            randomStudentDiv.textContent = "No students match the filter.";
            alert("No students match the filter.");
        }
    });
})();

//Citatons: Covalence Parse a CSV file With JS https://www.youtube.com/watch?v=oencyPPBTUQ
