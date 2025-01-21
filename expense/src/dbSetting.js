const prodDatabase={
    ExpenseTable:"tblExpense",
    CategoryTable:"tblCategory",
    IncomeTable:"tblIncome",
    IncomeCategoryTable:"tblIncomeCategory"
}

const devDatabase={
    ExpenseTable:"tblExpense_temp",
    CategoryTable:"tblCategory",
    IncomeTable:"tblIncome_temp",
    IncomeCategoryTable:"tblIncomeCategory"
}

const IncomeCategory=[{
    id:"vqAVMpLU1KZBWd12XQFN",
    name:"Paycheck"
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

const dbSetting=prodDatabase

export{dbSetting,IncomeCategory}