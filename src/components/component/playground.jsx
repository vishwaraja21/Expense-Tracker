import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Filter from 'bad-words';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export function Playground() {
    const { toast } = useToast();
    const [pageName, setPageName] = useState("Income");

    const [income, setIncome] = useState(0.00);

    const [expenses, setExpenses] = useState(0.00);

    const [balance, setBalance] = useState(0.00);

    const [amountinput, setAmountInput] = useState(0.00);

    const [category, setCategory] = useState("");

    const [notes, setNotes] = useState("");

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [todayDate, setTodayDate] = useState(getCurrentDate());

    const [incomedata, setIncomeData] = useState([]);

    const [allTransactions, setAllTransactions] = useState([]);

    function IncomeButtonClicked() {
        if (amountinput < 1) {
            toast({
                title: "Error:",
                description: "Please enter a valid amount in the input. Amount must be equal or greater than 1.",
            })
            return;
        }
        else if (category === "") {
            toast({
                title: "Error:",
                description: "Category cannot be empty. Please enter a valid category.",
            })
            return;
        }
        else if (notes === "") {
            toast({
                title: "Error:",
                description: "Notes cannot be empty. Please enter a valid note.",
            })
            return;
        }
        else if (notes.length > 12) {
            toast({
                title: "Error:",
                description: "Notes cannot be more than 12 characters. Please enter a valid note.",
            })
            return;
        }
        else if (amountinput > 1000000) {
            toast({
                title: "Error:",
                description: "Amount cannot be more than 1,000,000. Please enter a valid amount.",
            })
            return;
        }
        else if (category.length > 12) {
            toast({
                title: "Error:",
                description: "Category cannot be more than 12 characters. Please enter a valid category.",
            })
            return;
        }

        const filter = new Filter();
        if (filter.isProfane(notes) || filter.isProfane(category)) {
            toast({
                title: "Error:",
                description: "Please enter a valid note and category. Profanity is not allowed.",
            });
            return;
        }

        if (amountinput === null) {
            toast({
                title: "Error:",
                description: "Please enter a valid amount in the input. Amount must be equal or greater than 1.",
            })
            return;
        }


        setIncome(income + parseFloat(amountinput));
        setBalance(balance + parseFloat(amountinput));
        setIncomeData([...incomedata, { date: todayDate, category: category, amount: amountinput, notes: notes }]);
        setAllTransactions([...allTransactions, { type: "Income", date: todayDate, category: category, amount: amountinput, notes: notes }]);

        toast({
            title: "Success:",
            description: "Income added successfully.",
        });

        // clear data after adding income
        setAmountInput(0.00);
        setCategory("");
        setNotes("");
        return;
    }

    const [expensedata, setExpenseData] = useState(0.00);

    const [expenseCategory, setExpenseCategory] = useState("");

    const [expenseNotes, setExpenseNotes] = useState("");

    const [expensedataarray, setExpenseDataArray] = useState([]);

    function ExpenseClicked() {
        if (expensedata < 1) {
            toast({
                title: "Error:",
                description: "Please enter a valid amount in the input. Amount must be equal or greater than 1.",
            })
            return;
        }
        else if (expenseCategory === "") {
            toast({
                title: "Error:",
                description: "Category cannot be empty. Please enter a valid category.",
            })
            return;
        }
        else if (expenseNotes === "") {
            toast({
                title: "Error:",
                description: "Notes cannot be empty. Please enter a valid note.",
            })
            return;
        }
        else if (expenseNotes.length > 12) {
            toast({
                title: "Error:",
                description: "Notes cannot be more than 12 characters. Please enter a valid note.",
            })
            return;
        }
        else if (expensedata > 1000000) {
            toast({
                title: "Error:",
                description: "Amount cannot be more than 1,000,000. Please enter a valid amount.",
            })
            return;
        }
        else if (expenseCategory.length > 12) {
            toast({
                title: "Error:",
                description: "Category cannot be more than 12 characters. Please enter a valid category.",
            })
            return;
        }

        const filter = new Filter();
        if (filter.isProfane(expenseNotes) || filter.isProfane(expenseCategory)) {
            toast({
                title: "Error:",
                description: "Please enter a valid note and category. Profanity is not allowed.",
            });
            return;
        }

        if (expensedata === null) {
            toast({
                title: "Error:",
                description: "Please enter a valid amount in the input. Amount must be equal or greater than 1.",
            })
            return;
        }

        setExpenses(expenses + parseFloat(expensedata));
        setBalance(balance - parseFloat(expensedata));

        toast({
            title: "Success:",
            description: "Expense added successfully.",
        });

        setExpenseData(0.00);
        setExpenseCategory("");
        setExpenseNotes("");
        setExpenseDataArray([...expensedataarray, { date: todayDate, category: expenseCategory, amount: expensedata, notes: expenseNotes }]);
        setAllTransactions([...allTransactions, { type: "Expense", date: todayDate, category: expenseCategory, amount: expensedata, notes: expenseNotes }]);
        return;
    }

    const [balanceperCategory, setBalancePerCategory] = useState([]);

    function calculateBalancePerCategory(transactions) {
        const balancePerCategory = {};
        transactions.forEach(transaction => {
            const { type, category, amount } = transaction;
            if (!balancePerCategory[category]) {
                balancePerCategory[category] = 0;
            }
            if (type === "Income") {
                balancePerCategory[category] += amount;
            } else {
                balancePerCategory[category] += amount;
            }
        });
        return Object.entries(balancePerCategory).map(([category, totalAmount]) => ({ category, totalAmount }));
    }

    // in a use state when ever allTransactions is changed, recount the total balance of each distinct category
    useEffect(() => {
        // copy the all transactions
        const allTransactions_ = [...allTransactions];
        const expenseBalancePerCategory = calculateBalancePerCategory(allTransactions_.filter(transaction => transaction.type === "Expense"));

        // sort from amount highest to lowest
        const sortedExpenseBalancePerCategory = expenseBalancePerCategory.sort((a, b) => b.totalAmount - a.totalAmount);

        if (sortedExpenseBalancePerCategory.length > 6) {
            // get the top 6 categories
            const sorted = sortedExpenseBalancePerCategory.slice(0, 6);
            // parse int
            sorted.forEach(category => {
                category.totalAmount = parseInt(category.totalAmount);
            });
            setBalancePerCategory(sorted);
        }

        // parse int
        expenseBalancePerCategory.forEach(category => {
            category.totalAmount = parseInt(category.totalAmount);
        });

        setBalancePerCategory(sortedExpenseBalancePerCategory);
    }, [allTransactions]);

    const [top_six_transactions, setTopSixTransactions] = useState([]);

    // get the top 6 transactions after sorting them from highest to lowest
    useEffect(() => {
        // copy the all transactions
        const allTransactions_ = [...allTransactions];
        const sortedTransactions = allTransactions_.sort((a, b) => b.amount - a.amount);
        const topSixTransactions = sortedTransactions.slice(0, 6);
        topSixTransactions.forEach(transaction => {
            transaction.amount = parseInt(transaction.amount);
        });

        setTopSixTransactions(topSixTransactions);
    }, [allTransactions]);

    useEffect(() => {
        console.log("-------------------------------------");
        console.log("Income Data: ", incomedata);
        console.log("Expense Data: ", expensedataarray);
        console.log("All Transactions: ", allTransactions);
        console.log("Distinct category: ", balanceperCategory);
        console.log("Top 6: ", top_six_transactions);
        console.log("-------------------------------------");
    }, [incomedata, expensedataarray, allTransactions, balanceperCategory]);

    function DownloadPdf() {
        if (allTransactions.length === 0) {
            toast({
                title: "Error:",
                description: "No transactions found. Please add some transactions to download the PDF.",
            });
            return;
        }
        else if (allTransactions.length < 10) {
            toast({
                title: "Error:",
                description: "A minimum of 10 transactions are needed to download the PDF. Please add more transactions.",
            });
            return;
        }
        CreatePDFTables();
        return;
    }

    function getamount(amount, type) {
        if (type === "Income") {
            return `$${amount}`;
        }
        return `-$${amount}`;
    }

    function CreatePDFTables() {
        const doc = new jsPDF();
        // make the pdf page size A4 
        doc.autoTableSetDefaults({
            addPageContent: function (data) {
                doc.text("Expense Tracker - All Transactions", 16, 15);
            },
            margin: { top: 20 },
            headStyles: { fillColor: [0, 0, 0] },
            bodyStyles: { textColor: [0, 0, 0] },
        });
        doc.addFont('Helvetica', 'Helvetica', 'normal');
        doc.setFont('Helvetica');
        doc.setFontSize(12);

        doc.autoTable({
            head: [["Type", "Date", "Category", "Amount", "Notes"]],
            // justify the text to the center
            headStyles: { halign: 'center' },
            body: allTransactions.map(transaction => [
                transaction.type,
                transaction.date,
                transaction.category,
                getamount(transaction.amount, transaction.type),
                transaction.notes
            ]),
            bodyStyles: { halign: 'center' },
        });
        // Add text for total balance
        doc.text(`Total Balance: ${(balance > 0) ? `$${balance}` : `-$${Math.abs(balance)}`}`, 16, doc.autoTable.previous.finalY + 10);

        doc.save("transactions.pdf");
    }

    return (
        (<div className="grid min-h-screen w-full grid-cols-[260px_1fr]">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-6 flex-1 min-h-screen">
                <div className="flex h-full flex-col gap-6">
                    <div className="flex items-center gap-2 ml-6">
                        <WalletIcon className="h-6 w-6" />
                        <span className="text-lg font-semibold">Expense Tracker</span>
                    </div>
                    <nav className="flex flex-1 flex-col gap-2">
                        {pageName !== "Income" ? (
                            <Button variant="ghost" onClick={() => setPageName("Income")}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <CashIcon className="h-4 w-4" />
                                Income
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => setPageName("Income")}
                                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <CashIcon className="h-4 w-4" />
                                Income
                            </Button>)}
                        {pageName !== "Expenses" ?
                            (
                                <Button variant="ghost" onClick={() => setPageName("Expenses")}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    <ExpensesIcon className="h-4 w-4" />
                                    Expenses
                                </Button>) :
                            (
                                <Button variant="outline" onClick={() => setPageName("Expenses")}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    <ExpensesIcon className="h-4 w-4" />
                                    Expenses
                                </Button>
                            )}
                        {pageName !== "Reports" ?
                            (
                                <Button variant="ghost" onClick={() => setPageName("Reports")}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    <ReportIcon className="h-4 w-4" />
                                    Reports
                                </Button>
                            ) :
                            (
                                <Button variant="outline" onClick={() => setPageName("Reports")}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    <ReportIcon className="h-4 w-4" />
                                    Reports
                                </Button>
                            )}
                    </nav>
                </div>
            </div>

            <div className="flex flex-1 flex-col min-h-screen">
                <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <AddTransactionPopup income={income} expenses={expenses} balance={balance} setIncome={setIncome} setBalance={setBalance} setExpenses={setExpenses} setIncomeData={setIncomeData} setAllTransactions={setAllTransactions} setExpenseDataArray={setExpenseDataArray} incomedata={incomedata} expensedataarray={expensedataarray} allTransactions={allTransactions}
                        />
                    </div>
                </header>
                <main className="overflow-auto p-6 h-full">
                    {pageName === "Income" ?
                        (
                            <div className="grid flex-1 gap-6 min-w-[600px]">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Income</CardTitle>
                                        <CardDescription>All income transactions for the current month.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-green-600">$ {income}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add Income</CardTitle>
                                        <CardDescription>Record a new income transaction.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="date">Date</Label>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="w-full">
                                                                    <Input id="date" name="date" require type="date" value={todayDate} readonly className="text-black bg-white border border-gray-300 rounded px-3 py-2 pointer-events-none"
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="p-2">
                                                                        <h1 className="text-lg font-semibold mb-2"
                                                                        >Date</h1>
                                                                        <span className="text-sm"
                                                                        >The date of the transaction. This field is read-only (current date).</span>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="category">Category</Label>
                                                        <Input id="category" name="category" required type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter category here..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount">Amount</Label>
                                                        <Input id="amount" name="amount" required type="number" onChange={(e) => setAmountInput(e.target.value)} value={amountinput} placeholder="Enter amount here..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="notes">Notes</Label>
                                                        <Input id="notes" name="notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Enter any important note here..."
                                                        />
                                                    </div>
                                                </div>
                                                <Button className="justify-self-end" onClick={IncomeButtonClicked}
                                                >
                                                    Add Income
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : pageName === "Expenses" ? (
                            <div className="grid flex-1 gap-6 min-w-[600px]">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Total Expenses</CardTitle>
                                        <CardDescription>All expense transactions for the current month.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-red-600">$ {expenses}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Add Expense</CardTitle>
                                        <CardDescription>Record a new expense transaction.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="date">Date</Label>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger className="w-full">
                                                                    <Input id="date" name="date" require type="date" value={todayDate} readonly className="text-black bg-white border border-gray-300 rounded px-3 py-2 pointer-events-none"
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div className="p-2">
                                                                        <h1 className="text-lg font-semibold mb-2"
                                                                        >Date</h1>
                                                                        <span className="text-sm"
                                                                        >The date of the transaction. This field is read-only (current date).</span>
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="category">Category</Label>
                                                        <Input id="category" name="category" required type="text" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} placeholder="Enter category here..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount">Amount</Label>
                                                        <Input id="amount" name="amount" required type="number" onChange={(e) => setExpenseData(e.target.value)} value={expensedata} placeholder="Enter amount here..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="notes">Notes</Label>
                                                        <Input id="notes" name="notes" type="text" value={expenseNotes} onChange={(e) => setExpenseNotes(e.target.value)} placeholder="Enter any important note here..."
                                                        />
                                                    </div>
                                                </div>
                                                <Button className="justify-self-end" type="submit" onClick={ExpenseClicked}
                                                >
                                                    Add Expense
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="grid flex-1 gap-6 min-w-[600px]" id="report-income-all">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Balance</CardTitle>
                                        <CardDescription>The difference between your total income and total expenses.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-blue-600">
                                            {(balance >= 0) ? `$ ${balance}` : `-$${Math.abs(balance)}`}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Transactions List</CardTitle>
                                        <CardDescription>All income and expense transactions for the current month.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {incomedata.length === 0 && expensedataarray.length === 0 ? (
                                            <Card className="flex items-center justify-center h-32">
                                                <NotfoundIcon className="h-8 w-8" />
                                                <span className="ml-2">No transactions found.</span>
                                            </Card>
                                        ) : (
                                            <Table classname="rounded-md"
                                            >
                                                <TableCaption>A list of your recent transactions.</TableCaption>
                                                <TableHeader>
                                                    <TableRow className="bg-gray-100 dark:bg-gray-800 justify-center text-center"
                                                    >
                                                        <TableHead className="text-center"
                                                        >Transaction Type</TableHead>
                                                        <TableHead className="text-center">Date</TableHead>
                                                        <TableHead className="text-center">Category</TableHead>
                                                        <TableHead className="text-center">Amount</TableHead>
                                                        <TableHead className="text-center">Notes</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto"
                                                    style={{ scrollbarWidth: "none" }}
                                                >
                                                    {allTransactions.map((transaction, index) => (
                                                        <TableRow key={index} className="text-center">
                                                            <TableCell key={index} className="text-center" >
                                                                {transaction.type}
                                                            </TableCell>
                                                            <TableCell key={index} className="text-center" >
                                                                {transaction.date}
                                                            </TableCell>
                                                            <TableCell key={index} className="text-center" >
                                                                {transaction.category}
                                                            </TableCell>
                                                            <TableCell key={index} className="text-center" >
                                                                {(transaction.type === "Income") ? `$${transaction.amount}` : `-$${transaction.amount}`}
                                                            </TableCell>
                                                            <TableCell key={index} className="text-center" >
                                                                {transaction.notes}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell className="text-center">Total:</TableCell>
                                                        <TableCell colSpan={3}></TableCell>
                                                        <TableCell className="text-center">
                                                            {(balance > 0) ? `$${balance}` : `-$${Math.abs(balance)}`}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        )}
                                    </CardContent>
                                </Card>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Income vs Expenses</CardTitle>
                                            <CardDescription>A comparison of your total income and total expenses (top 6 transactions). The red bar represents expense and green bar represents income.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="mb-2"
                                        >
                                            {allTransactions.length < 6 ? (
                                                <Card className="flex items-center justify-center h-32">
                                                    <HoverCard>
                                                        <HoverCardTrigger>
                                                            <div className="flex items-center justify-center h-32">
                                                                <NotfoundIcon className="h-8 w-8" />
                                                                <span className="ml-2">No transactions found.</span>
                                                            </div>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent>
                                                            <div className="p-2">
                                                                <h1 className="text-lg font-semibold mb-2"
                                                                >Error: No transactions found.</h1>
                                                                <span className="text-sm"
                                                                >A minimum of 6 transactions are needed to show the data comparisons. This bar chart shown the top 6 transactions (income or expense).</span>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </Card>
                                            ) : (
                                                <BarChart className="aspect-[4/3]" top_six_transactions={top_six_transactions}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Expense Breakdown</CardTitle>
                                            <CardDescription>A breakdown of your expenses by category (top 6 distinct categories). It shows the total amount spent (expense) on each category.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {balanceperCategory.length < 6 ? (
                                                <Card className="flex items-center justify-center h-32">
                                                    <HoverCard>
                                                        <HoverCardTrigger>
                                                            <div className="flex items-center justify-center h-32">
                                                                <NotfoundIcon className="h-8 w-8" />
                                                                <span className="ml-2">No transactions found.</span>
                                                            </div>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent>
                                                            <div className="p-2">
                                                                <h1 className="text-lg font-semibold mb-2"
                                                                >Error: No transactions found.</h1>
                                                                <span className="text-sm"
                                                                >A minimum of 6 distinct category transactions are needed to show the data comparisons. This pie chart shows the balance of top 6 categories.</span>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </Card>
                                            ) : (

                                                <PieChart className="aspect-square" balanceperCategory={balanceperCategory}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                                <Button className="justify-self-end" onClick={DownloadPdf}
                                >
                                    Download PDF Report
                                </Button>
                            </div>
                        )}
                </main>
            </div >
            <Toaster />
        </div >)
    );
}

function AddTransactionPopup({ income, expenses, balance, setIncome, setBalance, setExpenses, setIncomeData, setAllTransactions, setExpenseDataArray, incomedata, expensedataarray, allTransactions }) {
    const [open, setOpen] = useState(false);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [todayDate, setTodayDate] = useState(getCurrentDate());

    const [category_, setCategory_] = useState("");
    const [amount_, setAmount_] = useState(0.00);
    const [notes_, setNotes_] = useState("");

    const { toast } = useToast();

    const AddClicked = () => {
        if (amount_ === 0) {
            toast({
                title: "Error:",
                description: "Please enter a valid amount in the input. Amount must not be zero.",
            })
            return;
        }
        else if (category_ === "") {
            toast({
                title: "Error:",
                description: "Category cannot be empty. Please enter a valid category.",
            })
            return;
        }
        else if (notes_ === "") {
            toast({
                title: "Error:",
                description: "Notes cannot be empty. Please enter a valid note.",
            })
            return;
        }
        else if (notes_.length > 12) {
            toast({
                title: "Error:",
                description: "Notes cannot be more than 12 characters. Please enter a valid note.",
            })
            return;
        }
        else if (amount_ > 1000000 || amount_ < -1000000) {
            toast({
                title: "Error:",
                description: "Amount cannot be more than 1,000,000 or less than -1,000,000. Please enter a valid amount.",
            })
            return;
        }
        else if (category_.length > 12) {
            toast({
                title: "Error:",
                description: "Category cannot be more than 12 characters. Please enter a valid category.",
            })
            return;
        }

        const filter = new Filter();
        if (filter.isProfane(notes_) || filter.isProfane(category_)) {
            toast({
                title: "Error:",
                description: "Please enter a valid note and category. Profanity is not allowed.",
            });
            return;
        }

        if (amount_ === null) {
            toast({
                title: "Error:",
                description: "Please enter a valid amount in the input. Amount must not be zero or null.",
            })
            return;
        }

        if (amount_ > 0) { // positive amount is considered as income

            setIncome(income + parseFloat(amount_));
            setBalance(balance + parseFloat(amount_));
            setIncomeData([...incomedata, { date: todayDate, category: category_, amount: amount_, notes: notes_ }]);
            setAllTransactions([...allTransactions, { type: "Income", date: todayDate, category: category_, amount: amount_, notes: notes_ }]);
            toast({
                title: "Success:",
                description: "Income added successfully.",
            });
        }
        else { // negative amount is considered as expense
            setExpenses(expenses + parseFloat(amount_ * -1));
            setBalance(balance - parseFloat(amount_ * -1));
            var amt = amount_ * -1;
            setExpenseDataArray([...expensedataarray, { date: todayDate, category: category_, amount: amt, notes: notes_ }]);
            setAllTransactions([...allTransactions, { type: "Expense", date: todayDate, category: category_, amount: amt, notes: notes_ }]);
            toast({
                title: "Success:",
                description: "Expense added successfully.",
            });
        }

        // clear data after adding income
        setAmount_(0.00);
        setCategory_("");
        setNotes_("");
        setOpen(false);
        return;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}
        >
            <DialogTrigger>
                <Button size="sm" variant="outline" className="ml-4 justify-self-end">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Add a new income or expense transaction. Positive amount is considered as income and negative amount is considered as expense.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" required type="text" placeholder="Enter category here..." value={category_} onChange={(e) => setCategory_(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" name="date" require type="date" value={todayDate} readonly className="text-black bg-white border border-gray-300 rounded px-3 py-2 pointer-events-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input id="amount" name="amount" required type="number" placeholder="Enter amount here..." value={amount_} onChange={(e) => setAmount_(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input id="notes" name="notes" type="text" placeholder="Enter any note here..." value={notes_} onChange={(e) => setNotes_(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 justify-self-end mt-2">
                        <Button className="justify-self-end" onClick={() => setOpen(false)} variant="destructive"
                        >
                            Cancel
                        </Button>
                        <Button className="justify-self-start" onClick={AddClicked}
                        >
                            Add Transaction
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}

function BarChart({ top_six_transactions }) {
    const [maxYLimit, setMaxYLimit] = useState(null);

    useEffect(() => {
        const maxAmount_ = Math.max(...top_six_transactions.map(transaction => transaction.amount));
        const maxYLimit_ = Math.ceil(maxAmount_ * 1.3);
        setMaxYLimit(maxYLimit_);
    }, [top_six_transactions]);

    const formatTick = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${value / 1000}k`;
        }
        return value;
    };

    const getColor = (bar) => {
        const transaction = top_six_transactions[bar.index];
        return transaction.type === "Income" ? "#16a34a" : "#dc2626";
    };

    return (
        <div className="aspect-[4/3] mt-4">
            <ResponsiveBar
                data={top_six_transactions.map((transaction, index) => ({
                    name: `${index + 1}th`,
                    count: transaction.amount,
                }))}
                colors={getColor}
                keys={['count']}
                indexBy="name"
                margin={{ top: 0, right: 0, bottom: 40, left: 50 }}
                padding={0.3}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 16,
                    tickValues: 5,
                    format: formatTick,
                }}
                gridYValues={5}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                tooltipLabel={({ id }) => `${id}`}
                enableLabel={false}
                role="application"
                ariaLabel="A bar chart showing data"
                maxValue={maxYLimit} // Ensure the max value is set for the y-axis
            />
        </div>
    );
}

function PieChart({ balanceperCategory }) {
    return (
        (<div className="aspect-square">
            <ResponsivePie
                data={[
                    { id: balanceperCategory[0].category, value: balanceperCategory[0].totalAmount },
                    { id: balanceperCategory[1].category, value: balanceperCategory[1].totalAmount },
                    { id: balanceperCategory[2].category, value: balanceperCategory[2].totalAmount },
                    { id: balanceperCategory[3].category, value: balanceperCategory[3].totalAmount },
                    { id: balanceperCategory[4].category, value: balanceperCategory[4].totalAmount },
                    { id: balanceperCategory[5].category, value: balanceperCategory[5].totalAmount },
                ]}
                sortByValue
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                cornerRadius={0}
                padAngle={0}
                colors={["#DE6B48", "#E5B181", "#F4B9B2", "#DAEDBD", "#7DBBC3", "#97D8B2"]}
                borderWidth={1}
                borderColor={"#ffffff"}
                enableArcLinkLabels={false}
                arcLabel={` `}
                arcLabelsTextColor={"#ffffff"}
                arcLabelsRadiusOffset={0.65}
                theme={{
                    labels: {
                        text: {
                            fontSize: "18px",
                        },
                    },
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                }}
                role="application" />
        </div>)
    );
}

function BarChartIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="12" x2="12" y1="20" y2="10" />
            <line x1="18" x2="18" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="16" />
        </svg>)
    );
}

function DollarSignIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>)
    );
}

function PlusIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>)
    );
}

function WalletIcon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path
                d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>)
    );
}

function ReportIcon(props) {
    return (
        (<svg
            {...props}
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29289 1.29289C9.48043 1.10536 9.73478 1 10 1H18C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V8C3 7.73478 3.10536 7.48043 3.29289 7.29289L9.29289 1.29289ZM18 3H11V8C11 8.55228 10.5523 9 10 9H5V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3ZM6.41421 7H9V4.41421L6.41421 7ZM7 13C7 12.4477 7.44772 12 8 12H16C16.5523 12 17 12.4477 17 13C17 13.5523 16.5523 14 16 14H8C7.44772 14 7 13.5523 7 13ZM7 17C7 16.4477 7.44772 16 8 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17Z" fill="#000000" />
        </svg>)
    );
}

function CashIcon(props) {
    return (
        (<svg
            {...props}
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3 5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V5ZM4 2C2.34315 2 1 3.34315 1 5V19C1 20.6569 2.34315 22 4 22H20C21.6569 22 23 20.6569 23 19V5C23 3.34315 21.6569 2 20 2H4ZM6 8C6 7.44772 6.44772 7 7 7H17C17.5523 7 18 7.44772 18 8C18 8.55228 17.5523 9 17 9H7C6.44772 9 6 8.55228 6 8ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM6 16C6 15.4477 6.44772 15 7 15H17C17.5523 15 18 15.4477 18 16C18 16.5523 17.5523 17 17 17H7C6.44772 17 6 16.5523 6 16Z" fill="#000000" />
        </svg>
        )
    );
}

function ExpensesIcon(props) {
    return (
        (<svg
            {...props}
            width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13.0001H13M7 9.0001H9M7 17.0001H13M16 21.0001H18.5M17 21.0001H7.8C6.11984 21.0001 5.27976 21.0001 4.63803 20.6731C4.07354 20.3855 3.6146 19.9266 3.32698 19.3621C3 18.7203 3 17.8803 3 16.2001V5.75719C3 4.8518 3 4.3991 3.1902 4.13658C3.35611 3.90758 3.61123 3.75953 3.89237 3.72909C4.21467 3.6942 4.60772 3.9188 5.39382 4.368L5.70618 4.54649C5.99552 4.71183 6.14019 4.7945 6.29383 4.82687C6.42978 4.85551 6.57022 4.85551 6.70617 4.82687C6.85981 4.7945 7.00448 4.71183 7.29382 4.54649L9.20618 3.45372C9.49552 3.28838 9.64019 3.20571 9.79383 3.17334C9.92978 3.14469 10.0702 3.14469 10.2062 3.17334C10.3598 3.20571 10.5045 3.28838 10.7938 3.45372L12.7062 4.54649C12.9955 4.71183 13.1402 4.7945 13.2938 4.82687C13.4298 4.85551 13.5702 4.85551 13.7062 4.82687C13.8598 4.7945 14.0045 4.71183 14.2938 4.54649L14.6062 4.368C15.3923 3.9188 15.7853 3.6942 16.1076 3.72909C16.3888 3.75953 16.6439 3.90758 16.8098 4.13658C17 4.3991 17 4.8518 17 5.75719V14.0001M17 13.0001H21V19.0001C21 20.1047 20.1046 21.0001 19 21.0001C17.8954 21.0001 17 20.1047 17 19.0001V13.0001Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        )
    );
}

function NotfoundIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12" y1="16" y2="16" />
        </svg>
    );
}