export type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  code?: string;
  repeatCount?: number;
};

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which of the following is NOT a feature of object-oriented programming?",
    options: [
      "Encapsulation",
      "Polymorphism",
      "Recursion",
      "Inheritance"
    ],
    answer: "Recursion"
  },
  {
    id: 2,
    question: "What is the default port number for HTTPS?",
    options: [
      "80",
      "21",
      "443",
      "8080"
    ],
    answer: "443"
  },
  {
    id: 3,
    question: "Which command is used to display the routing table in Linux?",
    options: [
      "ifconfig",
      "route",
      "netstat -r",
      "ping"
    ],
    answer: "netstat -r"
  },
  {
    id: 4,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: [
      "Bubble Sort",
      "Merge Sort",
      "Selection Sort",
      "Insertion Sort"
    ],
    answer: "Merge Sort"
  },
  {
    id: 5,
    question: "Which protocol is used for secure file transfer over SSH?",
    options: [
      "FTP",
      "SFTP",
      "SMTP",
      "HTTP"
    ],
    answer: "SFTP"
  },
  {
    id: 6,
    question: "Which of the following is a non-relational database?",
    options: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Oracle"
    ],
    answer: "MongoDB"
  },
  {
    id: 7,
    question: "Which layer of the OSI model is responsible for end-to-end communication?",
    options: [
      "Network",
      "Transport",
      "Session",
      "Data Link"
    ],
    answer: "Transport"
  },
  {
    id: 8,
    question: "What is the output of 2 ** 3 in Python?",
    options: [
      "6",
      "8",
      "9",
      "5"
    ],
    answer: "8"
  },
  {
    id: 9,
    question: "Which Linux command is used to change file permissions?",
    options: [
      "chmod",
      "chown",
      "ls",
      "mv"
    ],
    answer: "chmod"
  },
  {
    id: 10,
    question: "Which of the following is NOT a valid HTTP method?",
    options: [
      "GET",
      "POST",
      "FETCH",
      "PUT"
    ],
    answer: "FETCH"
  },
  {
    id: 11,
    question: "Which data structure uses FIFO (First In First Out) principle?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Graph"
    ],
    answer: "Queue"
  },
  {
    id: 12,
    question: "Which command is used to display running processes in Linux?",
    options: [
      "ls",
      "ps",
      "cd",
      "rm"
    ],
    answer: "ps"
  },
  {
    id: 13,
    question: "Which of the following is a stateless protocol?",
    options: [
      "TCP",
      "UDP",
      "FTP",
      "SMTP"
    ],
    answer: "UDP"
  },
  {
    id: 14,
    question: "Which keyword is used to inherit a class in Java?",
    options: [
      "extends",
      "implements",
      "inherits",
      "super"
    ],
    answer: "extends"
  },
  {
    id: 15,
    question: "Which of the following is NOT a type of operating system?",
    options: [
      "Batch",
      "Time-sharing",
      "Distributed",
      "Compiler"
    ],
    answer: "Compiler"
  },
  {
    id: 16,
    question: "Which protocol is used to assign IP addresses automatically?",
    options: [
      "DNS",
      "DHCP",
      "HTTP",
      "FTP"
    ],
    answer: "DHCP"
  },
  {
    id: 17,
    question: "Which of the following is used to prevent SQL injection?",
    options: [
      "Prepared Statements",
      "Cookies",
      "Sessions",
      "Triggers"
    ],
    answer: "Prepared Statements"
  },
  {
    id: 18,
    question: "Which command is used to search for a pattern in files in Linux?",
    options: [
      "find",
      "grep",
      "awk",
      "sed"
    ],
    answer: "grep"
  },
  {
    id: 19,
    question: "Which of the following is NOT a valid IP address?",
    options: [
      "192.168.1.1",
      "255.255.255.255",
      "10.0.0.256",
      "172.16.0.1"
    ],
    answer: "10.0.0.256"
  },
  {
    id: 20,
    question: "Which of the following is a compiled language?",
    options: [
      "Python",
      "Java",
      "JavaScript",
      "HTML"
    ],
    answer: "Java"
  },
  {
    id: 21,
    question: "Which command is used to display disk usage in Linux?",
    options: [
      "df",
      "du",
      "ls",
      "pwd"
    ],
    answer: "df"
  },
  {
    id: 22,
    question: "Which of the following is NOT a NoSQL database?",
    options: [
      "MongoDB",
      "Redis",
      "Cassandra",
      "SQLite"
    ],
    answer: "SQLite"
  },
  {
    id: 23,
    question: "Which protocol is used for email transmission?",
    options: [
      "SMTP",
      "FTP",
      "HTTP",
      "SNMP"
    ],
    answer: "SMTP"
  },
  {
    id: 24,
    question: "Which of the following is NOT a valid subnet mask?",
    options: [
      "255.255.255.0",
      "255.255.0.0",
      "255.0.255.0",
      "255.255.255.128"
    ],
    answer: "255.0.255.0"
  },
  {
    id: 25,
    question: "Which of the following is NOT a valid data type in C?",
    options: [
      "int",
      "float",
      "string",
      "char"
    ],
    answer: "string"
  },
  {
    id: 26,
    question: "Which command is used to display the current working directory in Linux?",
    options: [
      "pwd",
      "ls",
      "cd",
      "mv"
    ],
    answer: "pwd"
  },
  {
    id: 27,
    question: "Which of the following is NOT a valid HTTP status code?",
    options: [
      "200",
      "404",
      "500",
      "700"
    ],
    answer: "700"
  },
  {
    id: 28,
    question: "Which of the following is a connection-oriented protocol?",
    options: [
      "UDP",
      "TCP",
      "ICMP",
      "ARP"
    ],
    answer: "TCP"
  },
  {
    id: 29,
    question: "Which of the following is NOT a Linux distribution?",
    options: [
      "Ubuntu",
      "Fedora",
      "Windows",
      "Debian"
    ],
    answer: "Windows"
  },
  {
    id: 30,
    question: "Which of the following is NOT a valid loop in JavaScript?",
    options: [
      "for",
      "while",
      "foreach",
      "do-while"
    ],
    answer: "foreach"
  },
  {
    id: 31,
    question: "Which command is used to list all files, including hidden ones, in Linux?",
    options: [
      "ls -a",
      "ls -l",
      "ls -h",
      "ls -s"
    ],
    answer: "ls -a"
  },
  {
    id: 32,
    question: "Which of the following is NOT a valid CSS selector?",
    options: [
      ".class",
      "#id",
      "element",
      "@media"
    ],
    answer: "@media"
  },
  {
    id: 33,
    question: "Which of the following is NOT a valid SQL command?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "FETCHALL"
    ],
    answer: "FETCHALL"
  },
  {
    id: 34,
    question: "Which of the following is NOT a valid HTTP header?",
    options: [
      "Content-Type",
      "User-Agent",
      "Accept",
      "File-Type"
    ],
    answer: "File-Type"
  },
  {
    id: 35,
    question: "Which of the following is NOT a valid JavaScript data type?",
    options: [
      "Number",
      "String",
      "Boolean",
      "Character"
    ],
    answer: "Character"
  },
  {
    id: 36,
    question: "Which of the following is NOT a valid Linux file permission?",
    options: [
      "r",
      "w",
      "x",
      "e"
    ],
    answer: "e"
  },
  {
    id: 37,
    question: "Which of the following is NOT a valid HTTP response code?",
    options: [
      "201",
      "302",
      "418",
      "609"
    ],
    answer: "609"
  },
  {
    id: 38,
    question: "Which of the following is NOT a valid Java access modifier?",
    options: [
      "public",
      "private",
      "protected",
      "internal"
    ],
    answer: "internal"
  },
  {
    id: 39,
    question: "Which of the following is NOT a valid Python data structure?",
    options: [
      "List",
      "Tuple",
      "Dictionary",
      "ArrayList"
    ],
    answer: "ArrayList"
  },
  {
    id: 40,
    question: "Which of the following is NOT a valid Linux command?",
    options: [
      "ls",
      "cd",
      "mv",
      "copy"
    ],
    answer: "copy"
  },
  {
    id: 41,
    question: "Which of the following is NOT a valid HTML tag?",
    options: [
      "<div>",
      "<span>",
      "<section>",
      "<item>"
    ],
    answer: "<item>"
  },
  {
    id: 42,
    question: "Which of the following is NOT a valid C++ operator?",
    options: [
      "++",
      "--",
      "**",
      "->"
    ],
    answer: "**"
  },
  {
    id: 43,
    question: "Which of the following is NOT a valid JavaScript framework?",
    options: [
      "React",
      "Angular",
      "Vue",
      "Django"
    ],
    answer: "Django"
  },
  {
    id: 44,
    question: "Which of the following is NOT a valid SQL data type?",
    options: [
      "INT",
      "VARCHAR",
      "BOOLEAN",
      "ARRAY"
    ],
    answer: "ARRAY"
  },
  {
    id: 45,
    question: "Which of the following is NOT a valid Linux shell?",
    options: [
      "bash",
      "zsh",
      "fish",
      "dash"
    ],
    answer: "dash"
  },
  {
    id: 46,
    question: "Which of the following is NOT a valid HTTP method?",
    options: [
      "PATCH",
      "TRACE",
      "CONNECT",
      "SEND"
    ],
    answer: "SEND"
  },
  {
    id: 47,
    question: "Which of the following is NOT a valid JavaScript event?",
    options: [
      "onclick",
      "onhover",
      "onload",
      "onchange"
    ],
    answer: "onhover"
  },
  {
    id: 48,
    question: "Which of the following is NOT a valid Python keyword?",
    options: [
      "def",
      "class",
      "function",
      "lambda"
    ],
    answer: "function"
  },
  {
    id: 49,
    question: "Which of the following is NOT a valid Linux process state?",
    options: [
      "Running",
      "Sleeping",
      "Stopped",
      "Paused"
    ],
    answer: "Paused"
  },
  {
    id: 50,
    question: "Which of the following is NOT a valid HTTP status code?",
    options: [
      "200",
      "404",
      "500",
      "600"
    ],
    answer: "600"
  },
  {
    id: 51,
    question: "Which of the following is NOT a valid JavaScript operator?",
    options: [
      "+",
      "-",
      "===",
      "=="
    ],
    answer: "==="
  },
  {
    id: 52,
    question: "Which of the following is NOT a valid SQL clause?",
    options: [
      "WHERE",
      "GROUP BY",
      "ORDER BY",
      "SORT BY"
    ],
    answer: "SORT BY"
  },
  {
    id: 53,
    question: "Which of the following is NOT a valid Linux file system?",
    options: [
      "ext4",
      "NTFS",
      "FAT32",
      "APFS"
    ],
    answer: "APFS"
  },
  {
    id: 54,
    question: "Which of the following is NOT a valid JavaScript function?",
    options: [
      "alert()",
      "prompt()",
      "confirm()",
      "display()"
    ],
    answer: "display()"
  },
  {
    id: 55,
    question: "Which of the following is NOT a valid SQL join?",
    options: [
      "INNER JOIN",
      "OUTER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN"
    ],
    answer: "OUTER JOIN"
  },
  {
    id: 56,
    question: "Which of the following is NOT a valid Linux user command?",
    options: [
      "useradd",
      "usermod",
      "userdel",
      "useredit"
    ],
    answer: "useredit"
  },
  {
    id: 57,
    question: "Which of the following is NOT a valid JavaScript array method?",
    options: [
      "push()",
      "pop()",
      "shift()",
      "remove()"
    ],
    answer: "remove()"
  },
  {
    id: 58,
    question: "Which of the following is NOT a valid SQL aggregate function?",
    options: [
      "SUM()",
      "AVG()",
      "COUNT()",
      "TOTAL()"
    ],
    answer: "TOTAL()"
  },
  {
    id: 59,
    question: "Which of the following is NOT a valid Linux network command?",
    options: [
      "ifconfig",
      "ip",
      "netstat",
      "network"
    ],
    answer: "network"
  },
  {
    id: 60,
    question: "Which of the following is NOT a valid JavaScript object property?",
    options: [
      "length",
      "size",
      "constructor",
      "prototype"
    ],
    answer: "size"
  },
  {
    id: 61,
    question: "Which of the following is NOT a valid SQL constraint?",
    options: [
      "PRIMARY KEY",
      "FOREIGN KEY",
      "UNIQUE",
      "INDEX"
    ],
    answer: "INDEX"
  },
  {
    id: 62,
    question: "Which of the following is NOT a valid Linux package manager?",
    options: [
      "apt",
      "yum",
      "brew",
      "npm"
    ],
    answer: "npm"
  },
  {
    id: 63,
    question: "Which of the following is NOT a valid JavaScript loop?",
    options: [
      "for",
      "while",
      "do-while",
      "repeat-until"
    ],
    answer: "repeat-until"
  },
  {
    id: 64,
    question: "Which of the following is NOT a valid SQL data type?",
    options: [
      "INT",
      "VARCHAR",
      "BOOLEAN",
      "TEXTUAL"
    ],
    answer: "TEXTUAL"
  },
  {
    id: 65,
    question: "Which of the following is NOT a valid Linux file type?",
    options: [
      "Regular file",
      "Directory",
      "Symbolic link",
      "Hard link"
    ],
    answer: "Hard link"
  },
  {
    id: 66,
    question: "Which of the following is NOT a valid JavaScript string method?",
    options: [
      "charAt()",
      "substring()",
      "substr()",
      "splitAt()"
    ],
    answer: "splitAt()"
  },
  {
    id: 67,
    question: "Which of the following is NOT a valid SQL keyword?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "MODIFY"
    ],
    answer: "MODIFY"
  },
  {
    id: 68,
    question: "Which of the following is NOT a valid Linux process management command?",
    options: [
      "ps",
      "top",
      "kill",
      "end"
    ],
    answer: "end"
  },
  {
    id: 69,
    question: "Which of the following is NOT a valid JavaScript number method?",
    options: [
      "toFixed()",
      "toPrecision()",
      "toString()",
      "toNumber()"
    ],
    answer: "toNumber()"
  },
  {
    id: 70,
    question: "Which of the following is NOT a valid SQL operator?",
    options: [
      "AND",
      "OR",
      "NOT",
      "XOR"
    ],
    answer: "XOR"
  },
  {
    id: 71,
    question: "Which of the following is NOT a valid Linux text editor?",
    options: [
      "vim",
      "nano",
      "emacs",
      "edit"
    ],
    answer: "edit"
  },
  {
    id: 72,
    question: "Which of the following is NOT a valid JavaScript Math method?",
    options: [
      "Math.abs()",
      "Math.sqrt()",
      "Math.pow()",
      "Math.square()"
    ],
    answer: "Math.square()"
  },
  {
    id: 73,
    question: "Which of the following is NOT a valid SQL function?",
    options: [
      "NOW()",
      "CURDATE()",
      "GETDATE()",
      "TODAY()"
    ],
    answer: "TODAY()"
  },
  {
    id: 74,
    question: "Which of the following is NOT a valid Linux archive command?",
    options: [
      "tar",
      "zip",
      "gzip",
      "archive"
    ],
    answer: "archive"
  },
  {
    id: 75,
    question: "Which of the following is NOT a valid JavaScript array property?",
    options: [
      "length",
      "size",
      "constructor",
      "prototype"
    ],
    answer: "size"
  },
  {
    id: 76,
    question: "Which of the following is NOT a valid SQL statement?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "CHANGE"
    ],
    answer: "CHANGE"
  },
  {
    id: 77,
    question: "Which of the following is NOT a valid Linux networking tool?",
    options: [
      "ping",
      "traceroute",
      "netcat",
      "networker"
    ],
    answer: "networker"
  },
  {
    id: 78,
    question: "Which of the following is NOT a valid JavaScript object method?",
    options: [
      "hasOwnProperty()",
      "toString()",
      "isPrototypeOf()",
      "getProperty()"
    ],
    answer: "getProperty()"
  },
  {
    id: 79,
    question: "Which of the following is NOT a valid SQL join type?",
    options: [
      "INNER JOIN",
      "OUTER JOIN",
      "LEFT JOIN",
      "CROSS JOIN"
    ],
    answer: "OUTER JOIN"
  },
  {
    id: 80,
    question: "Which of the following is NOT a valid Linux file system?",
    options: [
      "ext4",
      "NTFS",
      "FAT32",
      "HFS+"
    ],
    answer: "HFS+"
  },
  {
    id: 81,
    question: "Which of the following is NOT a valid JavaScript event?",
    options: [
      "onclick",
      "onload",
      "onchange",
      "onpress"
    ],
    answer: "onpress"
  },
  {
    id: 82,
    question: "Which of the following is NOT a valid SQL clause?",
    options: [
      "WHERE",
      "GROUP BY",
      "ORDER BY",
      "FILTER BY"
    ],
    answer: "FILTER BY"
  },
  {
    id: 83,
    question: "Which of the following is NOT a valid Linux command?",
    options: [
      "ls",
      "cd",
      "mv",
      "move"
    ],
    answer: "move"
  },
  {
    id: 84,
    question: "Which of the following is NOT a valid JavaScript function?",
    options: [
      "alert()",
      "prompt()",
      "confirm()",
      "display()"
    ],
    answer: "display()"
  },
  {
    id: 85,
    question: "Which of the following is NOT a valid SQL aggregate function?",
    options: [
      "SUM()",
      "AVG()",
      "COUNT()",
      "TOTAL()"
    ],
    answer: "TOTAL()"
  },
  {
    id: 86,
    question: "Which of the following is NOT a valid Linux network command?",
    options: [
      "ifconfig",
      "ip",
      "netstat",
      "network"
    ],
    answer: "network"
  },
  {
    id: 87,
    question: "Which of the following is NOT a valid JavaScript object property?",
    options: [
      "length",
      "size",
      "constructor",
      "prototype"
    ],
    answer: "size"
  },
  {
    id: 88,
    question: "Which of the following is NOT a valid SQL constraint?",
    options: [
      "PRIMARY KEY",
      "FOREIGN KEY",
      "UNIQUE",
      "INDEX"
    ],
    answer: "INDEX"
  },
  {
    id: 89,
    question: "Which of the following is NOT a valid Linux package manager?",
    options: [
      "apt",
      "yum",
      "brew",
      "npm"
    ],
    answer: "npm"
  },
  {
    id: 90,
    question: "Which of the following is NOT a valid JavaScript loop?",
    options: [
      "for",
      "while",
      "do-while",
      "repeat-until"
    ],
    answer: "repeat-until"
  },
  {
    id: 91,
    question: "Which of the following is NOT a valid SQL data type?",
    options: [
      "INT",
      "VARCHAR",
      "BOOLEAN",
      "TEXTUAL"
    ],
    answer: "TEXTUAL"
  },
  {
    id: 92,
    question: "Which of the following is NOT a valid Linux file type?",
    options: [
      "Regular file",
      "Directory",
      "Symbolic link",
      "Hard link"
    ],
    answer: "Hard link"
  },
  {
    id: 93,
    question: "Which of the following is NOT a valid JavaScript string method?",
    options: [
      "charAt()",
      "substring()",
      "substr()",
      "splitAt()"
    ],
    answer: "splitAt()"
  },
  {
    id: 94,
    question: "Which of the following is NOT a valid SQL keyword?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "MODIFY"
    ],
    answer: "MODIFY"
  },
  {
    id: 95,
    question: "Which of the following is NOT a valid Linux process management command?",
    options: [
      "ps",
      "top",
      "kill",
      "end"
    ],
    answer: "end"
  },
  {
    id: 96,
    question: "Which of the following is NOT a valid JavaScript number method?",
    options: [
      "toFixed()",
      "toPrecision()",
      "toString()",
      "toNumber()"
    ],
    answer: "toNumber()"
  },
  {
    id: 97,
    question: "Which of the following is NOT a valid SQL operator?",
    options: [
      "AND",
      "OR",
      "NOT",
      "XOR"
    ],
    answer: "XOR"
  },
  {
    id: 98,
    question: "Which of the following is NOT a valid Linux text editor?",
    options: [
      "vim",
      "nano",
      "emacs",
      "edit"
    ],
    answer: "edit"
  },
  {
    id: 99,
    question: "Which of the following is NOT a valid JavaScript Math method?",
    options: [
      "Math.abs()",
      "Math.sqrt()",
      "Math.pow()",
      "Math.square()"
    ],
    answer: "Math.square()"
  },
  {
    id: 100,
    question: "Which of the following is NOT a valid SQL function?",
    options: [
      "NOW()",
      "CURDATE()",
      "GETDATE()",
      "TODAY()"
    ],
    answer: "TODAY()"
  },
  {
    id: 101,
    question: "Which command is used to display the manual of a command in Linux?",
    options: [
      "help",
      "man",
      "info",
      "doc"
    ],
    answer: "man"
  },
  {
    id: 102,
    question: "Which of the following is a hashing algorithm?",
    options: [
      "SHA-256",
      "AES",
      "RSA",
      "DES"
    ],
    answer: "SHA-256"
  },
  {
    id: 103,
    question: "Which protocol is used to resolve domain names to IP addresses?",
    options: [
      "FTP",
      "DNS",
      "DHCP",
      "SMTP"
    ],
    answer: "DNS"
  },
  {
    id: 104,
    question: "Which of the following is NOT a valid HTTP status code for redirection?",
    options: [
      "301",
      "302",
      "307",
      "404"
    ],
    answer: "404"
  },
  {
    id: 105,
    question: "Which of the following is NOT a valid data structure in Java?",
    options: [
      "ArrayList",
      "HashMap",
      "LinkedList",
      "SetList"
    ],
    answer: "SetList"
  },
  {
    id: 106,
    question: "Which command is used to terminate a process in Linux?",
    options: [
      "kill",
      "end",
      "stop",
      "terminate"
    ],
    answer: "kill"
  },
  {
    id: 107,
    question: "Which of the following is NOT a valid HTTP request header?",
    options: [
      "Accept",
      "Host",
      "Referer",
      "Location"
    ],
    answer: "Location"
  },
  {
    id: 108,
    question: "Which of the following is NOT a valid SQL statement?",
    options: [
      "SELECT",
      "INSERT",
      "REMOVE",
      "UPDATE"
    ],
    answer: "REMOVE"
  },
  {
    id: 109,
    question: "Which of the following is NOT a valid Linux signal?",
    options: [
      "SIGKILL",
      "SIGSTOP",
      "SIGPAUSE",
      "SIGTERM"
    ],
    answer: "SIGPAUSE"
  },
  {
    id: 110,
    question: "Which of the following is NOT a valid JavaScript variable declaration?",
    options: [
      "var",
      "let",
      "const",
      "define"
    ],
    answer: "define"
  },
  {
    id: 111,
    question: "Which protocol is used for remote login to a server?",
    options: [
      "FTP",
      "SSH",
      "SMTP",
      "HTTP"
    ],
    answer: "SSH"
  },
  {
    id: 112,
    question: "Which of the following is NOT a valid SQL function?",
    options: [
      "COUNT()",
      "SUM()",
      "MAXIMUM()",
      "MIN()"
    ],
    answer: "MAXIMUM()"
  },
  {
    id: 113,
    question: "Which of the following is NOT a valid Linux runlevel?",
    options: [
      "0",
      "3",
      "5",
      "7"
    ],
    answer: "7"
  },
  {
    id: 114,
    question: "Which of the following is NOT a valid Java interface?",
    options: [
      "Serializable",
      "Cloneable",
      "Runnable",
      "Inheritable"
    ],
    answer: "Inheritable"
  },
  {
    id: 115,
    question: "Which of the following is NOT a valid HTTP method?",
    options: [
      "GET",
      "POST",
      "UPDATE",
      "DELETE"
    ],
    answer: "UPDATE"
  },
  {
    id: 116,
    question: "Which of the following is NOT a valid SQL keyword?",
    options: [
      "SELECT",
      "INSERT",
      "MERGE",
      "APPEND"
    ],
    answer: "APPEND"
  },
  {
    id: 117,
    question: "Which of the following is NOT a valid Linux environment variable?",
    options: [
      "PATH",
      "HOME",
      "USER",
      "ROOT"
    ],
    answer: "ROOT"
  },
  {
    id: 118,
    question: "Which of the following is NOT a valid JavaScript array method?",
    options: [
      "map()",
      "filter()",
      "reduce()",
      "collect()"
    ],
    answer: "collect()"
  },
  {
    id: 119,
    question: "Which of the following is NOT a valid SQL join?",
    options: [
      "LEFT JOIN",
      "RIGHT JOIN",
      "FULL JOIN",
      "PARTIAL JOIN"
    ],
    answer: "PARTIAL JOIN"
  },
  {
    id: 120,
    question: "Which of the following is NOT a valid Linux file system?",
    options: [
      "ext3",
      "ext4",
      "NTFS",
      "FAT64"
    ],
    answer: "FAT64"
  },
  {
    id: 121,
    question: "Which of the following is NOT a valid JavaScript event?",
    options: [
      "onblur",
      "onfocus",
      "onhover",
      "oninput"
    ],
    answer: "onhover"
  },
  {
    id: 122,
    question: "Which of the following is NOT a valid SQL clause?",
    options: [
      "WHERE",
      "HAVING",
      "ORDER",
      "GROUP"
    ],
    answer: "ORDER"
  },
  {
    id: 123,
    question: "Which of the following is NOT a valid Linux command?",
    options: [
      "ls",
      "cd",
      "mv",
      "movefile"
    ],
    answer: "movefile"
  },
  {
    id: 124,
    question: "Which of the following is NOT a valid JavaScript function?",
    options: [
      "parseInt()",
      "parseFloat()",
      "toNumber()",
      "isNaN()"
    ],
    answer: "toNumber()"
  },
  {
    id: 125,
    question: "Which of the following is NOT a valid SQL aggregate function?",
    options: [
      "SUM()",
      "AVG()",
      "COUNT()",
      "TOTALSUM()"
    ],
    answer: "TOTALSUM()"
  },
  {
    id: 126,
    question: "Which of the following is NOT a valid Linux network command?",
    options: [
      "ifconfig",
      "ip",
      "netstat",
      "networkctl"
    ],
    answer: "networkctl"
  },
  {
    id: 127,
    question: "Which of the following is NOT a valid JavaScript object property?",
    options: [
      "length",
      "constructor",
      "prototype",
      "sizeOf"
    ],
    answer: "sizeOf"
  },
  {
    id: 128,
    question: "Which of the following is NOT a valid SQL constraint?",
    options: [
      "PRIMARY KEY",
      "FOREIGN KEY",
      "UNIQUE",
      "MANDATORY"
    ],
    answer: "MANDATORY"
  },
  {
    id: 129,
    question: "Which of the following is NOT a valid Linux package manager?",
    options: [
      "apt",
      "yum",
      "pacman",
      "pip"
    ],
    answer: "pip"
  },
  {
    id: 130,
    question: "Which of the following is NOT a valid JavaScript loop?",
    options: [
      "for",
      "while",
      "do-while",
      "repeat"
    ],
    answer: "repeat"
  },
  {
    id: 131,
    question: "Which of the following is NOT a valid SQL data type?",
    options: [
      "INT",
      "VARCHAR",
      "BOOLEAN",
      "CHARACTER"
    ],
    answer: "CHARACTER"
  },
  {
    id: 132,
    question: "Which of the following is NOT a valid Linux file type?",
    options: [
      "Regular file",
      "Directory",
      "Symbolic link",
      "Soft link"
    ],
    answer: "Soft link"
  },
  {
    id: 133,
    question: "Which of the following is NOT a valid JavaScript string method?",
    options: [
      "charAt()",
      "substring()",
      "split()",
      "join()"
    ],
    answer: "join()"
  },
  {
    id: 134,
    question: "Which of the following is NOT a valid SQL keyword?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "REPLACEALL"
    ],
    answer: "REPLACEALL"
  },
  {
    id: 135,
    question: "Which of the following is NOT a valid Linux process management command?",
    options: [
      "ps",
      "top",
      "kill",
      "process"
    ],
    answer: "process"
  },
  {
    id: 136,
    question: "Which of the following is NOT a valid JavaScript number method?",
    options: [
      "toFixed()",
      "toPrecision()",
      "toString()",
      "parseNumber()"
    ],
    answer: "parseNumber()"
  },
  {
    id: 137,
    question: "Which of the following is NOT a valid SQL operator?",
    options: [
      "AND",
      "OR",
      "NOT",
      "BETWEENALL"
    ],
    answer: "BETWEENALL"
  },
  {
    id: 138,
    question: "Which of the following is NOT a valid Linux text editor?",
    options: [
      "vim",
      "nano",
      "emacs",
      "notepad"
    ],
    answer: "notepad"
  },
  {
    id: 139,
    question: "Which of the following is NOT a valid JavaScript Math method?",
    options: [
      "Math.abs()",
      "Math.sqrt()",
      "Math.pow()",
      "Math.cube()"
    ],
    answer: "Math.cube()"
  },
  {
    id: 140,
    question: "Which of the following is NOT a valid SQL function?",
    options: [
      "NOW()",
      "CURDATE()",
      "GETDATE()",
      "CURRENTTIME()"
    ],
    answer: "CURRENTTIME()"
  },
  {
    id: 141,
    question: "Which of the following is NOT a valid Linux archive command?",
    options: [
      "tar",
      "zip",
      "gzip",
      "compressor"
    ],
    answer: "compressor"
  },
  {
    id: 142,
    question: "Which of the following is NOT a valid JavaScript array property?",
    options: [
      "length",
      "constructor",
      "prototype",
      "capacity"
    ],
    answer: "capacity"
  },
  {
    id: 143,
    question: "Which of the following is NOT a valid SQL statement?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "MODIFY"
    ],
    answer: "MODIFY"
  },
  {
    id: 144,
    question: "Which of the following is NOT a valid Linux networking tool?",
    options: [
      "ping",
      "traceroute",
      "netcat",
      "netwatch"
    ],
    answer: "netwatch"
  },
  {
    id: 145,
    question: "Which of the following is NOT a valid JavaScript object method?",
    options: [
      "hasOwnProperty()",
      "toString()",
      "isPrototypeOf()",
      "getOwn()"
    ],
    answer: "getOwn()"
  },
  {
    id: 146,
    question: "Which of the following is NOT a valid SQL join type?",
    options: [
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "MIDDLE JOIN"
    ],
    answer: "MIDDLE JOIN"
  },
  {
    id: 147,
    question: "Which of the following is NOT a valid Linux file system?",
    options: [
      "ext4",
      "NTFS",
      "FAT32",
      "ZFSX"
    ],
    answer: "ZFSX"
  },
  {
    id: 148,
    question: "Which of the following is NOT a valid JavaScript event?",
    options: [
      "onclick",
      "onload",
      "onchange",
      "onpresskey"
    ],
    answer: "onpresskey"
  },
  {
    id: 149,
    question: "Which of the following is NOT a valid SQL clause?",
    options: [
      "WHERE",
      "GROUP BY",
      "ORDER BY",
      "SORT"
    ],
    answer: "SORT"
  },
  {
    id: 150,
    question: "Which of the following is NOT a valid Linux command?",
    options: [
      "ls",
      "cd",
      "mv",
      "copyfile"
    ],
    answer: "copyfile"
  },
  {
    id: 151,
    question: "Which of the following is NOT a valid JavaScript function?",
    options: [
      "alert()",
      "prompt()",
      "confirm()",
      "show()"
    ],
    answer: "show()"
  },
  {
    id: 152,
    question: "Which of the following is NOT a valid SQL aggregate function?",
    options: [
      "SUM()",
      "AVG()",
      "COUNT()",
      "TOTALCOUNT()"
    ],
    answer: "TOTALCOUNT()"
  },
  {
    id: 153,
    question: "Which of the following is NOT a valid Linux network command?",
    options: [
      "ifconfig",
      "ip",
      "netstat",
      "netinfo"
    ],
    answer: "netinfo"
  },
  {
    id: 154,
    question: "Which of the following is NOT a valid JavaScript object property?",
    options: [
      "length",
      "constructor",
      "prototype",
      "dimension"
    ],
    answer: "dimension"
  },
  {
    id: 155,
    question: "Which of the following is NOT a valid SQL constraint?",
    options: [
      "PRIMARY KEY",
      "FOREIGN KEY",
      "UNIQUE",
      "MANDATE"
    ],
    answer: "MANDATE"
  },
  {
    id: 156,
    question: "Which of the following is NOT a valid Linux package manager?",
    options: [
      "apt",
      "yum",
      "brew",
      "packman"
    ],
    answer: "packman"
  },
  {
    id: 157,
    question: "Which of the following is NOT a valid JavaScript loop?",
    options: [
      "for",
      "while",
      "do-while",
      "foreachloop"
    ],
    answer: "foreachloop"
  },
  {
    id: 158,
    question: "Which of the following is NOT a valid SQL data type?",
    options: [
      "INT",
      "VARCHAR",
      "BOOLEAN",
      "NUMERICSTRING"
    ],
    answer: "NUMERICSTRING"
  },
  {
    id: 159,
    question: "Which of the following is NOT a valid Linux file type?",
    options: [
      "Regular file",
      "Directory",
      "Symbolic link",
      "Virtual file"
    ],
    answer: "Virtual file"
  },
  {
    id: 160,
    question: "Which of the following is NOT a valid JavaScript string method?",
    options: [
      "charAt()",
      "substring()",
      "split()",
      "merge()"
    ],
    answer: "merge()"
  },
  {
    id: 161,
    question: "Which of the following is NOT a valid SQL keyword?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "RETRIEVE"
    ],
    answer: "RETRIEVE"
  },
  {
    id: 162,
    question: "Which of the following is NOT a valid Linux process management command?",
    options: [
      "ps",
      "top",
      "kill",
      "procman"
    ],
    answer: "procman"
  },
  {
    id: 163,
    question: "Which of the following is NOT a valid JavaScript number method?",
    options: [
      "toFixed()",
      "toPrecision()",
      "toString()",
      "numberFormat()"
    ],
    answer: "numberFormat()"
  },
  {
    id: 164,
    question: "Which of the following is NOT a valid SQL operator?",
    options: [
      "AND",
      "OR",
      "NOT",
      "EXCEPTS"
    ],
    answer: "EXCEPTS"
  },
  {
    id: 165,
    question: "Which of the following is NOT a valid Linux text editor?",
    options: [
      "vim",
      "nano",
      "emacs",
      "wordpad"
    ],
    answer: "wordpad"
  },
  {
    id: 166,
    question: "Which of the following is NOT a valid JavaScript Math method?",
    options: [
      "Math.abs()",
      "Math.sqrt()",
      "Math.pow()",
      "Math.divide()"
    ],
    answer: "Math.divide()"
  },
  {
    id: 167,
    question: "Which of the following is NOT a valid SQL function?",
    options: [
      "NOW()",
      "CURDATE()",
      "GETDATE()",
      "CURRENTDATE()"
    ],
    answer: "CURRENTDATE()"
  },
  {
    id: 168,
    question: "Which of the following is NOT a valid Linux archive command?",
    options: [
      "tar",
      "zip",
      "gzip",
      "archiver"
    ],
    answer: "archiver"
  },
  {
    id: 169,
    question: "Which of the following is NOT a valid JavaScript array property?",
    options: [
      "length",
      "constructor",
      "prototype",
      "elements"
    ],
    answer: "elements"
  },
  {
    id: 170,
    question: "Which of the following is NOT a valid SQL statement?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "ALTERATE"
    ],
    answer: "ALTERATE"
  },
  {
    id: 171,
    question: "Which of the following is NOT a valid Linux networking tool?",
    options: [
      "ping",
      "traceroute",
      "netcat",
      "netstatx"
    ],
    answer: "netstatx"
  },
  {
    id: 172,
    question: "Which of the following is NOT a valid JavaScript object method?",
    options: [
      "hasOwnProperty()",
      "toString()",
      "isPrototypeOf()",
      "getPrototype()"
    ],
    answer: "getPrototype()"
  },
  {
    id: 173,
    question: "Which of the following is NOT a valid SQL join type?",
    options: [
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "OUTERLEFT JOIN"
    ],
    answer: "OUTERLEFT JOIN"
  },
  {
    id: 174,
    question: "Which of the following is NOT a valid Linux file system?",
    options: [
      "ext4",
      "NTFS",
      "FAT32",
      "EXT5"
    ],
    answer: "EXT5"
  },
  {
    id: 175,
    question: "Which of the following is NOT a valid JavaScript event?",
    options: [
      "onclick",
      "onload",
      "onchange",
      "onpressbutton"
    ],
    answer: "onpressbutton"
  },
  {
    id: 176,
    question: "Which of the following is NOT a valid SQL clause?",
    options: [
      "WHERE",
      "GROUP BY",
      "ORDER BY",
      "ORDERED BY"
    ],
    answer: "ORDERED BY"
  },
  {
    id: 177,
    question: "Which of the following is NOT a valid Linux command?",
    options: [
      "ls",
      "cd",
      "mv",
      "moveit"
    ],
    answer: "moveit"
  },
  {
    id: 178,
    question: "Which of the following is NOT a valid JavaScript function?",
    options: [
      "alert()",
      "prompt()",
      "confirm()",
      "notify()"
    ],
    answer: "notify()"
  },
  {
    id: 179,
    question: "Which of the following is NOT a valid SQL aggregate function?",
    options: [
      "SUM()",
      "AVG()",
      "COUNT()",
      "COUNTALL()"
    ],
    answer: "COUNTALL()"
  },
  {
    id: 180,
    question: "Which of the following is NOT a valid Linux network command?",
    options: [
      "ifconfig",
      "ip",
      "netstat",
      "networks"
    ],
    answer: "networks"
  },
  {
    id: 181,
    question: "Which of the following is NOT a valid JavaScript object property?",
    options: [
      "length",
      "constructor",
      "prototype",
      "objectSize"
    ],
    answer: "objectSize"
  },
  {
    id: 182,
    question: "Which of the following is NOT a valid SQL constraint?",
    options: [
      "PRIMARY KEY",
      "FOREIGN KEY",
      "UNIQUE",
      "REQUIRED"
    ],
    answer: "REQUIRED"
  },
  {
    id: 183,
    question: "Which of the following is NOT a valid Linux package manager?",
    options: [
      "apt",
      "yum",
      "brew",
      "packager"
    ],
    answer: "packager"
  },
  {
    id: 184,
    question: "Which of the following is NOT a valid JavaScript loop?",
    options: [
      "for",
      "while",
      "do-while",
      "loopfor"
    ],
    answer: "loopfor"
  },
  {
    id: 185,
    question: "Which of the following is NOT a valid SQL data type?",
    options: [
      "INT",
      "VARCHAR",
      "BOOLEAN",
      "NUM"
    ],
    answer: "NUM"
  },
  {
    id: 186,
    question: "Which of the following is NOT a valid Linux file type?",
    options: [
      "Regular file",
      "Directory",
      "Symbolic link",
      "File link"
    ],
    answer: "File link"
  },
  {
    id: 187,
    question: "Which of the following is NOT a valid JavaScript string method?",
    options: [
      "charAt()",
      "substring()",
      "split()",
      "concatAll()"
    ],
    answer: "concatAll()"
  },
  {
    id: 188,
    question: "Which of the following is NOT a valid SQL keyword?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "FETCH"
    ],
    answer: "FETCH"
  },
  {
    id: 189,
    question: "Which of the following is NOT a valid Linux process management command?",
    options: [
      "ps",
      "top",
      "kill",
      "processman"
    ],
    answer: "processman"
  },
  {
    id: 190,
    question: "Which of the following is NOT a valid JavaScript number method?",
    options: [
      "toFixed()",
      "toPrecision()",
      "toString()",
      "numberToString()"
    ],
    answer: "numberToString()"
  },
  {
    id: 191,
    question: "Which of the following is NOT a valid SQL operator?",
    options: [
      "AND",
      "OR",
      "NOT",
      "EXCLUSIVE"
    ],
    answer: "EXCLUSIVE"
  },
  {
    id: 192,
    question: "Which of the following is NOT a valid Linux text editor?",
    options: [
      "vim",
      "nano",
      "emacs",
      "editor"
    ],
    answer: "editor"
  },
  {
    id: 193,
    question: "Which of the following is NOT a valid JavaScript Math method?",
    options: [
      "Math.abs()",
      "Math.sqrt()",
      "Math.pow()",
      "Math.multiply()"
    ],
    answer: "Math.multiply()"
  },
  {
    id: 194,
    question: "Which of the following is NOT a valid SQL function?",
    options: [
      "NOW()",
      "CURDATE()",
      "GETDATE()",
      "DATEOF()"
    ],
    answer: "DATEOF()"
  },
  {
    id: 195,
    question: "Which of the following is NOT a valid Linux archive command?",
    options: [
      "tar",
      "zip",
      "gzip",
      "arch"
    ],
    answer: "arch"
  },
  {
    id: 196,
    question: "Which of the following is NOT a valid JavaScript array property?",
    options: [
      "length",
      "constructor",
      "prototype",
      "arraySize"
    ],
    answer: "arraySize"
  },
  {
    id: 197,
    question: "Which of the following is NOT a valid SQL statement?",
    options: [
      "SELECT",
      "INSERT",
      "UPDATE",
      "REPLACE"
    ],
    answer: "REPLACE"
  },
  {
    id: 198,
    question: "Which of the following is NOT a valid Linux networking tool?",
    options: [
      "ping",
      "traceroute",
      "netcat",
      "netping"
    ],
    answer: "netping"
  },
  {
    id: 199,
    question: "Which of the following is NOT a valid JavaScript object method?",
    options: [
      "hasOwnProperty()",
      "toString()",
      "isPrototypeOf()",
      "objectOf()"
    ],
    answer: "objectOf()"
  },
  {
    id: 200,
    question: "Which of the following is NOT a valid SQL join type?",
    options: [
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "OUTER JOIN"
    ],
    answer: "OUTER JOIN"
  }
];