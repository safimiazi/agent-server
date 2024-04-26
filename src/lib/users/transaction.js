


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


const getingTransationTotal = async (days, searchQuery = 'Customer2') => {

    console.log('call api ');
    let AllDataListSearchDefault;

    try {

        let startDate, endDate; // search by date range 
        console.log(days, 'value check ');
        if (days.search !== 'undefined') {

            const currentDate = new Date();
            const timeRange = days.search;

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

            // make functionlity for all the calculation for work 

            const searchByTimes = await transactioListItem.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            })

            AllDataListSearchDefault = searchByTimes



        }


        // here now searchQuery functionlity 

        if (searchQuery) {
            // Fetch data based on searchQuery and time range
            const NameSearchValue = await transactioListItem.find({ customerId: searchQuery }); // search by customer id 
            AllDataListSearchDefault = NameSearchValue

        }


        // bydefault value search functionlity here now 

        AllDataListSearchDefault = await transactioListItem.find(); // All the value geting of transation list 

        // Get today's date
        const currentDate = new Date();


        // Initialize variables to hold the totals
        let totalAmount = 0;
        let totalPoints = 0;
        let totalDeposit = 0;
        let totalWithdrawAmount = 0;
        let totalWithdrawCredit = 0;
        let totalTransactions = 0;
        let uniqueCustomers = 0;
        let lastTransactionTime = null; // Variable to store the timestamp of the last transaction for today
        let totalPaymentMethod = {
            bkash: 0,
            rocket: 0,
            upay: 0,
            nagod: 0,
            bank: 0
        };
        const transactionsByCustomer = {};  // Initialize an object to store the number of transactions for each client
        

        // Iterate through each transaction
        AllDataListSearchDefault.forEach(transaction => {
            // Add the amount of each transaction to the total amount
            totalAmount += transaction.amount;

            // Add the points of each transaction to the total points
            totalPoints += transaction.points;

            // Check if the transaction is a deposit and add it to the total deposit
            if (transaction.transationType === 'deposit') {
                totalDeposit += transaction.amount;
            }

            // Check if the transaction is a withdrawal
            if (transaction.transationType === 'withdraw') {
                // Add the amount of each withdrawal to the total withdrawal amount
                totalWithdrawAmount += transaction.amount;

                // Add the credit of each withdrawal to the total withdrawal credit
                totalWithdrawCredit += transaction.points;
            }

            // Parse the createdAt timestamp of the transaction
            const transactionDate = new Date(transaction.createdAt);

            // Check if the transaction occurred today
            if (transactionDate.toDateString() === currentDate.toDateString()) {
                // Increment the transaction count for the customer
                transactionsByCustomer[transaction.customerId] = (transactionsByCustomer[transaction.customerId] || 0) + 1;

                // Update the lastTransactionTime if the transaction occurred later than the current lastTransactionTime
                if (!lastTransactionTime || transactionDate > new Date(lastTransactionTime)) {
                    lastTransactionTime = transactionDate.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
                }

            }


            // Check if the transaction payment method matches a specified method and add it to the total payment method
            if (['bkash', 'rocket', 'upay', 'nagod', 'bank'].includes(transaction.paymentType)) {

                // Check if the property exists in the totalPaymentMethod object
                if (totalPaymentMethod.hasOwnProperty(transaction.paymentType)) {
                    // If the property exists, add the transaction amount to it
                    totalPaymentMethod[transaction.paymentType] += transaction.amount;

                } else {
                    // If the property doesn't exist, initialize it to 0 and then add the transaction amount
                    totalPaymentMethod[transaction.paymentType] = transaction.amount;
                }
            }
        });


        // Iterate over each key-value pair in transactionsByCustomer
        for (const customerId in transactionsByCustomer) {
            // Add the count of transactions for the current customer to the totalTransactions
            totalTransactions += transactionsByCustomer[customerId];
            // Increment the uniqueCustomers count for each customer key
            uniqueCustomers++;
        }
        // calculation Need amout Balence for see users 
        const needAmountBalence = totalDeposit - totalWithdrawAmount;


        // Now you have the totals and filtered values
        console.log("Total Amount:", totalAmount);
        console.log("Total Points:", totalPoints);
        console.log("Total Deposit:", totalDeposit);
        console.log("Total Withdrawal Amount:", totalWithdrawAmount);
        console.log("Total Withdrawal Credit:", totalWithdrawCredit);
        console.log("Total Payment Method (bkash):", totalPaymentMethod.bkash);
        console.log("Total Payment Method (roket):", totalPaymentMethod.rocket);
        console.log("Total Payment Method (upay):", totalPaymentMethod.upay);
        console.log("Total Payment Method (nogod):", totalPaymentMethod.nagod);
        console.log("Total Payment Method (nogod):", totalPaymentMethod.bank);
        console.log("Customer Total Transation count time : ", totalTransactions);
        console.log("Last transation time : ", lastTransactionTime);
        console.log("unique Customer id Number ", uniqueCustomers);
        console.log("Need Balence ", needAmountBalence);



        return [
            { message: 'geting a data successsfully from the database ' },
            { TotalAmount: totalAmount },
            { TotalPoints: totalPoints },
            { TotalDeposit: totalDeposit },
            { TotalWithdrawalAmount: totalWithdrawAmount },
            { TotalWithdrawalCredit: totalWithdrawCredit },
            { TotalPaymentMethodbkash: totalPaymentMethod.bkash },
            { TotalPaymentMethodRoket: totalPaymentMethod.rocket },
            { TotalPaymentMethodUpay: totalPaymentMethod.upay },
            { TotalPaymentMethodNogod: totalPaymentMethod.nagod },
            { TotalPaymentMethodBank: totalPaymentMethod.bank },
            {TotalTransationToday : totalTransactions },
            {TodayLastTimeTransation : lastTransactionTime},
            {NeedBalenceWD: needAmountBalence }
        ]


    } catch (error) {
        // Handle any errors
        console.error("Error while fetching transaction data:", error);
        throw error;
    }
}


// return and export the value 

module.exports = { transactionInfo, getingTransactionInfo, getingTransationTotal } 