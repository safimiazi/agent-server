
// insert data to the database 

const { transactioListItem } = require("../../models/transaction");


// insert all the transation data insdie the database 
const transactionInfo = async (transation) => {
    try {
        console.log(transation);
        const insertTransation = new transactioListItem(transation)

        console.log(insertTransation, 'insert data modal list');



        const finallyInsert = await insertTransation.save()  // save data to mongoose with mongodb

        console.log(finallyInsert, 'data insert ');

        return { message: 'successfully insert Transation data ', finallyInsert };

    } catch (error) {
        return error
    }
}


// geting a transation information 

const getingTransactionInfo = async (searchQuery, page = 1, pageSize = 50) => {
    try {
        let query = {};

        // If searchQuery is provided, construct a regex pattern to match any part of the text
        if (searchQuery) {
            const regex = new RegExp(searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
            query = {
                $or: [
                    { orderId: { $regex: regex } },
                    { customerId: { $regex: regex } }
                    // Add more fields as needed
                ]
            };
        }

        // Calculate skip value for pagination
        const skip = (page) * pageSize;

        // Fetch client data from the database based on search criteria and pagination
        const clientListData = await transactioListItem.find(query).skip(skip).limit(pageSize) // with quiery data and pagination 
        const withOutQuery = await transactioListItem.find().skip(skip).limit(pageSize) // without querydata list and pagination 
        const TotalDataLenght = (await transactioListItem.find()).length

        console.log(clientListData, withOutQuery, TotalDataLenght);

        const finalliyValue = clientListData.length > 0 ? clientListData : withOutQuery;



        return { finalliyValue, TotalDataLenght };


    } catch (error) {
        return error
    }
}

// all the transation list here 


const getingTransationTotal = async (days) => {

    const convertArray = [...days?.search, days?.search];
    // Filter out search values that match predefined dates
    const storeDate = ['today', 'fastWeek', 'last-week', 'this-month', 'last-month'];
    const searchDateValues = convertArray.filter(item => storeDate.includes(item));

    // Filter out search values that don't match predefined dates
    const searchFieldValues = convertArray.filter(item => !storeDate.includes(item));

    // set variable for search functionlity 

    const fildSearchValue = searchFieldValues.includes('undefined') || searchFieldValues.includes(undefined)
        ? undefined
        : searchFieldValues[searchFieldValues.length - 1];

    // Check if 'undefined' exists in searchDateValues
    const dayTimeSearchValue = searchDateValues.includes('undefined') || searchDateValues.includes(undefined)
        ? undefined
        : searchDateValues[0];


    console.log(typeof (dayTimeSearchValue), typeof (fildSearchValue), fildSearchValue, dayTimeSearchValue , 'check the everythink');


    let AllDataListSearchDefault;

    try {

        let startDate, endDate; // search by date range 

        if (dayTimeSearchValue) {

            const currentDate = new Date();
            const timeRange = dayTimeSearchValue

            switch (timeRange) {
                case 'today':
                    startDate = new Date(currentDate);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(currentDate);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'fastWeek':
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - 7);
                    endDate = new Date(currentDate);
                    break;
                case 'last-week':
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - currentDate.getDay() - 6);
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);
                    break;
                case 'last-month':
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'this-month':
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                default:
                    throw new Error('Invalid timeRange');
            }


            console.log(startDate,'stard data ');
            console.log('end data ', endDate);

            // make functionlity for all the calculation for work 
            const searchByTotimes = await transactioListItem.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            console.log(searchByTotimes,'check data in weekly search ');

            AllDataListSearchDefault = searchByTotimes

        }


        // here now searchQuery functionlity 

        if (fildSearchValue && fildSearchValue.length > 1) {

            console.log('access the customer id ');
            // Fetch data based on searchQuery and time range
            const NameSearchValue = await transactioListItem.find({ customerId: fildSearchValue }); // search by customer id 
            // let allDataArray = []; // Initialize an empty array

            // if (NameSearchValue) {
            //     // If a document is found, push it into the array
            //     allDataArray.push(NameSearchValue);
            // }
            console.log(NameSearchValue , 'acccess the user search');
            AllDataListSearchDefault = NameSearchValue;

        }

        if (!dayTimeSearchValue && !fildSearchValue) {
            // bydefault value search functionlity here now 

            AllDataListSearchDefault = await transactioListItem.find(); // All the value geting of transation list 
        }

        console.log(AllDataListSearchDefault,'check the search value');


        // Get today's date
        const currentDate = new Date();

        // all the data deposite  store here , for sending database or calculcation 
        let totalAmount = 0;
        let totalPoints = 0;
        let totalDepositAmount = 0;
        let totalDepositCredite = 0;
        let dopsiteTransactions = 0;
        let dopositeUniqueCustomers = 0;
        let dopsiteTransactionTime = null; // Variable to store the timestamp of the last transaction for today
        const DopositetransactionsByCustomer = {};  // Initialize an object to store the number of transactions for each client
        let totalDopositePaymentMethod = {
            bkash: 0,
            rocket: 0,
            upay: 0,
            nagod: 0,
            bank: 0
        };

        // total withdraw infomation here for sending to frontend and calculation 
        let totalWithdrawAmount = 0;
        let totalWithdrawCredit = 0;
        let withdrawUniqueCustomers = 0;
        let withdrawTransactions = 0;
        let withdrawTransactionTime = null; // Variable to store the timestamp of the last transaction for today
        const withDrawtransactionsByCustomer = {};
        let totalWithDrawPaymentMethod = {
            bkash: 0,
            rocket: 0,
            upay: 0,
            nagod: 0,
            bank: 0
        };



        // Iterate through each transaction
        AllDataListSearchDefault.forEach(transaction => {

            // Parse the createdAt timestamp of the transaction
            const transactionDate = new Date(transaction.createdAt);
            // Add the amount of each transaction to the total amount
            totalAmount += transaction.amount;

            // Add the points of each transaction to the total points
            totalPoints += transaction.points;

            // Check if the transaction is a deposit and add it to the total deposit
            if (transaction.transationType === 'Deposit') {
                totalDepositAmount += transaction.amount;
                totalDepositCredite += transaction.points;

                // Check if the transaction occurred today
                if (transactionDate.toDateString() === currentDate.toDateString()) {
                    // Increment the transaction count for the customer
                    DopositetransactionsByCustomer[transaction.customerId] = (DopositetransactionsByCustomer[transaction.customerId] || 0) + 1;

                    // Update the lastTransactionTime if the transaction occurred later than the current lastTransactionTime
                    if (!dopsiteTransactionTime || transactionDate > new Date(dopsiteTransactionTime)) {
                        dopsiteTransactionTime = transactionDate.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
                    }

                }


                // Check if the transaction payment method matches a specified method and add it to the total payment method
                if (['bkash', 'rocket', 'upay', 'nagod', 'bank'].includes(transaction.paymentType)) {

                    // Check if the property exists in the totalPaymentMethod object
                    if (totalDopositePaymentMethod.hasOwnProperty(transaction.paymentType)) {
                        // If the property exists, add the transaction amount to it
                        totalDopositePaymentMethod[transaction.paymentType] += transaction.amount;

                    } else {
                        // If the property doesn't exist, initialize it to 0 and then add the transaction amount
                        totalDopositePaymentMethod[transaction.paymentType] = transaction.amount;
                    }
                }

            }

            // Check if the transaction is a withdrawal
            if (transaction.transationType === 'Withdraw') {
                // Add the amount of each withdrawal to the total withdrawal amount
                totalWithdrawAmount += transaction.amount;

                // Add the credit of each withdrawal to the total withdrawal credit
                totalWithdrawCredit += transaction.points;

                // Check if the transaction occurred today
                if (transactionDate.toDateString() === currentDate.toDateString()) {
                    // Increment the transaction count for the customer
                    withDrawtransactionsByCustomer[transaction.customerId] = (withDrawtransactionsByCustomer[transaction.customerId] || 0) + 1;

                    // Update the lastTransactionTime if the transaction occurred later than the current lastTransactionTime
                    if (!withdrawTransactionTime || transactionDate > new Date(withdrawTransactionTime)) {
                        withdrawTransactionTime = transactionDate.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
                    }

                }


                // Check if the transaction payment method matches a specified method and add it to the total payment method
                if (['bkash', 'rocket', 'upay', 'nagod', 'bank'].includes(transaction.paymentType)) {

                    // Check if the property exists in the totalPaymentMethod object
                    if (totalWithDrawPaymentMethod.hasOwnProperty(transaction.paymentType)) {
                        // If the property exists, add the transaction amount to it
                        totalWithDrawPaymentMethod[transaction.paymentType] += transaction.amount;

                    } else {
                        // If the property doesn't exist, initialize it to 0 and then add the transaction amount
                        totalWithDrawPaymentMethod[transaction.paymentType] = transaction.amount;
                    }
                }



            }
        });

        if (DopositetransactionsByCustomer) {
            // Iterate over each key-value pair in transactionsByCustomer
            for (const customerId in DopositetransactionsByCustomer) {
                // Add the count of transactions for the current customer to the totalTransactions
                dopsiteTransactions += DopositetransactionsByCustomer[customerId];
                // Increment the uniqueCustomers count for each customer key
                dopositeUniqueCustomers++;
            }
        }


        if (withDrawtransactionsByCustomer) {
            // Iterate over each key-value pair in transactionsByCustomer
            for (const customerId in withDrawtransactionsByCustomer) {
                // Add the count of transactions for the current customer to the totalTransactions
                withdrawTransactions += withDrawtransactionsByCustomer[customerId];
                // Increment the uniqueCustomers count for each customer key
                withdrawUniqueCustomers++;
            }
        }


        // Calculation the totalWidraw - dopsite and dopsite - withdraw

        const remainAmounts = totalDepositAmount - totalWithdrawAmount ; // total remain amount 
        const remainPoints  = totalDepositCredite - totalWithdrawCredit  // total remain point 
        const TotalDopositeAmount = remainAmounts ;
        const totalDopositePoints = remainPoints ;



        // Now you have the totals and filtered values
        // Log total deposite information
        console.log('Total amount:', totalAmount);
        console.log('Total points:', totalPoints);
        console.log('Total deposite amount:', remainAmounts);
        console.log('Total deposite credit:', remainPoints);
        console.log('Total deposite transactions:', dopsiteTransactions);
        console.log('Total deposite unique customers:', dopositeUniqueCustomers);
        console.log('Last deposite transaction time:', dopsiteTransactionTime);
        console.log('Deposite transactions by customer:', DopositetransactionsByCustomer);
        console.log('Total deposite payment method:', totalDopositePaymentMethod);

        // Log total withdraw information
        console.log('Total withdraw amount:', totalWithdrawAmount);
        console.log('Total withdraw credit:', totalWithdrawCredit);
        console.log('Total withdraw unique customers:', withdrawUniqueCustomers);
        console.log('Total withdraw transactions:', withdrawTransactions);
        console.log('Last withdraw transaction time:', withdrawTransactionTime);
        console.log('Withdraw transactions by customer:', withDrawtransactionsByCustomer);
        console.log('Total withdraw payment method:', totalWithDrawPaymentMethod);
        console.log('Total Remaining amounts ',remainAmounts );
        console.log('toal remain points ', remainPoints);

        return {
            message: 'succesfully geting data from server api ',
            remainAmounts,
            totalAmount,
            totalPoints,
            remainPoints,
            TotalDopositeAmount,
            totalDopositePoints,
            dopsiteTransactions,
            dopositeUniqueCustomers,
            dopsiteTransactionTime,
            DopositetransactionsByCustomer,
            totalDopositePaymentMethod,
            totalWithdrawAmount,
            totalWithdrawCredit,
            withdrawUniqueCustomers,
            withdrawTransactions,
            withdrawTransactionTime,
            withDrawtransactionsByCustomer,
            totalWithDrawPaymentMethod
        };

    } catch (error) {
        // Handle any errors
        console.error("Error while fetching transaction data:", error);
        throw error;
    }
}


// return and export the value 

module.exports = { transactionInfo, getingTransactionInfo, getingTransationTotal } 