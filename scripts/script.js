const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const modal = document.getElementById('modal');
const form = document.getElementById('applicationForm');
const tableBody = document.querySelector('#applicationTable tbody');

const statusMap = {
    '已投递': 25,
    '待面试': 50,
    '面试中': 75,
    '已录用': 100,
    '已拒绝': 0
};

// 读取公司名称和职位名称的 txt 文件
function loadDataFromTxt(filePath, datalistId) {
    fetch(filePath)
      .then(response => response.text())
      .then(data => {
            const lines = data.split('\n');
            const datalist = document.getElementById(datalistId);
            lines.forEach(line => {
                const option = document.createElement('option');
                option.value = line.trim();
                if (option.value) {
                    datalist.appendChild(option);
                }
            });
        })
      .catch(error => console.error('Error loading data:', error));
}

// 加载公司名称和职位名称
loadDataFromTxt('../data/companies.txt', 'companyList');
loadDataFromTxt('../data/positions.txt', 'positionList');

openModalButton.addEventListener('click', function () {
    modal.style.display = 'flex';
});

closeModalButton.addEventListener('click', function () {
    modal.style.display = 'none';
});

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const company = document.getElementById('company').value;
    const position = document.getElementById('position').value;
    const date = document.getElementById('date').value;
    const status = document.getElementById('status').value;
    const progress = statusMap[status];

    const newRow = tableBody.insertRow();
    const rankCell = newRow.insertCell(0);
    const companyCell = newRow.insertCell(1);
    const positionCell = newRow.insertCell(2);
    const dateCell = newRow.insertCell(3);
    const statusCell = newRow.insertCell(4);
    const actionCell = newRow.insertCell(5);

    companyCell.textContent = company;
    positionCell.textContent = position;
    dateCell.textContent = date;

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    const progressDiv = document.createElement('div');
    progressDiv.classList.add('progress');
    progressDiv.style.width = `${progress}%`;
    progressDiv.textContent = `${progress}%`;
    progressBar.appendChild(progressDiv);
    statusCell.appendChild(progressBar);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white', 'py-2', 'px-4', 'rounded-md');
    deleteButton.addEventListener('click', function () {
        tableBody.removeChild(newRow);
        updateRanks();
    });
    actionCell.appendChild(deleteButton);

    form.reset();
    modal.style.display = 'none';
    updateRanks();
});

function updateRanks() {
    const rows = Array.from(tableBody.rows);
    rows.sort((a, b) => {
        const progressA = parseInt(a.cells[4].querySelector('.progress').style.width);
        const progressB = parseInt(b.cells[4].querySelector('.progress').style.width);
        return progressB - progressA;
    });
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
        tableBody.appendChild(row);
    });
}    
