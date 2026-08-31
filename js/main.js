// LocalStorage Keys for Persistent Local Storage
const EMPLOYER_STORAGE_KEY = 'pindari_employer_data';
const CANDIDATE_STORAGE_KEY = 'pindari_candidate_data';

// Generic Mock Encryption Function
function encryptData(data) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function decryptData(cipherText) {
    if (!cipherText) return [];
    return JSON.parse(decodeURIComponent(escape(atob(cipherText))));
}

// Form Handlers
document.addEventListener('DOMContentLoaded', () => {
    const employerForm = document.getElementById('employerReqForm');
    const candidateForm = document.getElementById('candidateRegistrationForm');
    const generalForm = document.getElementById('generalEnquiryForm');

    if (employerForm) {
        employerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(employerForm);
            const entry = Object.fromEntries(formData.entries());
            entry.status = 'New';
            
            const existing = decryptData(localStorage.getItem(EMPLOYER_STORAGE_KEY));
            existing.push(entry);
            localStorage.setItem(EMPLOYER_STORAGE_KEY, encryptData(existing));
            
            alert('Hiring requirement submitted successfully!');
            employerForm.reset();
        });
    }

    if (candidateForm) {
        candidateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(candidateForm);
            const entry = Object.fromEntries(formData.entries());
            entry.status = 'New';
            
            const existing = decryptData(localStorage.getItem(CANDIDATE_STORAGE_KEY));
            existing.push(entry);
            localStorage.setItem(CANDIDATE_STORAGE_KEY, encryptData(existing));
            
            alert('Candidate registration submitted successfully!');
            candidateForm.reset();
        });
    }

    if (generalForm) {
        generalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for contacting Pindari Enterprises. We will respond shortly.');
            generalForm.reset();
        });
    }
});

// Admin Panel Functions
function loadAdminData() {
    const employers = decryptData(localStorage.getItem(EMPLOYER_STORAGE_KEY));
    const candidates = decryptData(localStorage.getItem(CANDIDATE_STORAGE_KEY));

    document.getElementById('totalRequirementsCount').innerText = employers.length;
    document.getElementById('totalCandidatesCount').innerText = candidates.length;

    const empBody = document.getElementById('employerTableBody');
    if (empBody) {
        empBody.innerHTML = employers.map((item, idx) => `
            <tr class="border-b">
                <td class="p-2 font-semibold">${item.companyName || ''}</td>
                <td class="p-2">${item.contactPerson || ''} (${item.phone || ''})</td>
                <td class="p-2">${item.category || ''}</td>
                <td class="p-2">${item.workersNeeded || ''}</td>
                <td class="p-2">${item.location || ''}</td>
                <td class="p-2">
                    <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">${item.status || 'New'}</span>
                </td>
            </tr>
        `).join('');
    }

    const candBody = document.getElementById('candidateTableBody');
    if (candBody) {
        candBody.innerHTML = candidates.map((item, idx) => `
            <tr class="border-b">
                <td class="p-2 font-semibold">${item.applicantName || ''}</td>
                <td class="p-2">${item.mobile || ''}</td>
                <td class="p-2">${item.qualification || ''}</td>
                <td class="p-2">${item.designation || ''}</td>
                <td class="p-2">${item.experience || ''} Yrs</td>
                <td class="p-2">
                    <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">${item.status || 'Reviewed'}</span>
                </td>
            </tr>
        `).join('');
    }
}

// Client-side Search and Filters
function filterEmployerTable() {
    const input = document.getElementById('filterEmployerInput').value.toLowerCase();
    const rows = document.querySelectorAll('#employerTableBody tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none';
    });
}

function filterCandidateTable() {
    const input = document.getElementById('filterCandidateInput').value.toLowerCase();
    const rows = document.querySelectorAll('#candidateTableBody tr');
    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none';
    });
}

// Export Table View to Excel / CSV
function exportTableToCSV(tableID, filename) {
    const table = document.getElementById(tableID);
    let csv = [];
    for (let i = 0; i < table.rows.length; i++) {
        let row = [], cols = table.rows[i].querySelectorAll('td, th');
        for (let j = 0; j < cols.length; j++) 
            row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
        csv.push(row.join(','));
    }
    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
}
