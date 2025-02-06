const prodDatabase={
    ExpenseTable:"tblExpense",
    CategoryTable:"tblCategory",
    IncomeTable:"tblIncome",
    IncomeCategoryTable:"tblIncomeCategory",
    BankingTable:"tblBanking",
    UserTable:"tblUser",
    PaymentTypeTable:"tblPaymentType",
    IncomeTypeTable:"tblIncomeType"
}

const devDatabase={
    ExpenseTable:"tblExpense_temps",
    CategoryTable:"tblCategory_temp",
    IncomeTable:"tblIncome_temp",
    IncomeCategoryTable:"tblIncomeCategory",
    BankingTable:"tblBanking_temp",
    UserTable:"tblUser_temp"
}

const IncomeCategory=[{
    id:"vqAVMpLU1KZBWd12XQFN",
    name:"Pay cheque"
},
{
    id:"4W3uLpjTFBvVJtDKJ3Qb",
    name:"Uber"
},
{
    id:"raXoUgPuzsp9lU8ciEot",
    name:"Lyft"
},
{
    id:"oGQXbbCbFtnyww0zkjQA",
    name:"WFG"
}
,
{
    id:"OI1SRkO8cnqmAJ2ujv39",
    name:"E-Transfer/Split"
}
,
{
    id:"jswYneAKLW8wXI3Jvpm8",
    name:"Other"
}
]

const paymentTypes = [
    { id: "1", name: "Visa" },
    { id: "2", name: "LOC" },
    { id: "3", name: "PC" },
    { id: "4", name: "Debit Card" },
    { id: "5", name: "Cash" },
  ];


const dbSetting=prodDatabase

export{dbSetting,IncomeCategory,paymentTypes,prodDatabase,devDatabase}