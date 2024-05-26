let invoices = [];

function loadInvoices() {
    const invoicesData = localStorage.getItem('invoices');
    if (invoicesData) {
        invoices = JSON.parse(invoicesData);
    }
}

function saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(invoices));
}

function displayInvoices() {
    const invoicesList = document.getElementById('invoicesList');
    invoicesList.innerHTML = '';

    invoices.forEach(invoice => {
        const listItem = document.createElement('li');
        const recurring = invoice.recurring ? 'Tak' : 'Nie';
        listItem.textContent = `${invoice.recipient} - Kwota: ${invoice.amount} zł - Termin: ${invoice.dueDate} - Cykliczna: ${recurring}`;

        const dueDate = new Date(invoice.dueDate);
        const reminderDate = new Date(dueDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const reminderMessage = `Przypomnienie: Płatność faktury ${invoice.recipient} (${invoice.amount} zł) jest za tydzień!`;

        const reminder = {
            date: reminderDate.toISOString().slice(0, 10),
            message: reminderMessage
        };

        if (!invoice.reminders) {
            invoice.reminders = [];
        }
        invoice.reminders.push(reminder);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => deleteInvoice(invoice.id));
        listItem.appendChild(deleteButton);

        invoicesList.appendChild(listItem);
    });

    saveInvoices();
}

function deleteInvoice(invoiceId) {
    invoices = invoices.filter(invoice => invoice.id !== invoiceId);
    saveInvoices();
    displayInvoices();
}

function addInvoice() {
    const recipient = document.getElementById('recipientInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const dueDate = document.getElementById('dueDateInput').value;
    const recurring = document.getElementById('recurringInput').checked;

    const newId = invoices.length > 0 ? invoices[invoices.length - 1].id + 1 : 1;

    const newInvoice = {
        id: newId,
        recipient: recipient,
        amount: amount,
        dueDate: dueDate,
        recurring: recurring,
        reminders: []
    };

    invoices.push(newInvoice);
    displayInvoices();

    document.getElementById('recipientInput').value = '';
    document.getElementById('amountInput').value = '';
    document.getElementById('dueDateInput').value = '';
    document.getElementById('recurringInput').checked = false;
}

function checkReminders() {
    invoices.forEach(invoice => {
        if (invoice.reminders) {
            invoice.reminders.forEach(reminder => {
                const today = new Date().toISOString().slice(0, 10);
                if (reminder.date === today) {
                    alert(reminder.message);
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadInvoices();
    displayInvoices();
    checkReminders();

    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addInvoice);
});