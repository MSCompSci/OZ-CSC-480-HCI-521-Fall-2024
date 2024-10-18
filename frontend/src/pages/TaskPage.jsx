import React, {useState} from "react";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.jsx";
import { Sidebar } from "@/components/ui/sidebar";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox.jsx";

const priorityOrder = {
    Low: 1,
    Medium: 2,
    High: 3,
};

const initialTasks = [
    {
        id: "task-1",
        completed: false,
        title: "Complete report",
        project: "Office Work",
        dueDate: "2024-10-20",
        priority: "High",
    },
    {
        id: "task-2",
        completed: false,
        title: "Design homepage",
        project: "Web Development",
        dueDate: "2024-10-22",
        priority: "Medium",
    },
    {
        id: "task-3",
        completed: true,
        title: "Team meeting",
        project: "Internal",
        dueDate: "2024-10-19",
        priority: "Low",
    },
];

export function TaskPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const handleSort = (key) => {
        let direction = "asc";

        // Toggle direction if the same key is being sorted
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key, direction });

        const sortedTasks = [...tasks].sort((a, b) => {
            if (key === "priority") {
                if (direction === "asc") {
                    if (priorityOrder[a.priority] < priorityOrder[b.priority]) {
                        return -1;
                    }
                    if (priorityOrder[a.priority] > priorityOrder[b.priority]) {
                        return 1;
                    }
                } else {
                    if (priorityOrder[a.priority] > priorityOrder[b.priority]) {
                        return -1;
                    }
                    if (priorityOrder[a.priority] < priorityOrder[b.priority]) {
                        return 1;
                    }
                }
                return 0;
            }

          if (direction === "asc") {
                if (a[key] < b[key]) {
                    return -1;
                }
                if (a[key] > b[key]) {
                    return 1;
                }
            } else {
                if (a[key] > b[key]) {
                    return -1;
                }
                if (a[key] < b[key]) {
                    return 1;
                }
            }
            return 0;
        });
        setTasks(sortedTasks);
    };
  // gui-init start : abd
                < div className='w-full max-w-2xl'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Task</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.filter(task => !task.archived).map(task => (
                                <TableRow key={task.id}>
                                    <TableCell className={task.done ? 'line-through text-gray-500' : ''}>
                                        {task.text}
                                    </TableCell>
                                    <TableCell>{task.done ? 'Completed' : 'Pending'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="icon"
                                            variant={task.done ? "default" : "outline"}
                                            onClick={() => toggleDone(task.id)}
                                            className="mr-2"
                                        >
                                            <CheckIcon className="h-4 w-4"/>
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => archiveTask(task.id)}
                                        >
                                            <ArchiveIcon className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <Sidebar title={"Test Title"}>
            <select
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="option1">Project 1</option>
                    <option value="option2">Project 2</option>
                    <option value="option3">Project 3</option>
                    <option value="option1">No Project</option>
                </select>


                <input
                type="date"
                className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 mb-4"
                >
                </input>


                <select
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="option1">Repeats Never</option>
                    <option value="option2">To be determined</option>
                    <option value="option3">To be determined</option>
                    <option value="option1">To be determined</option>
                </select>


                <Input
                className ='mb-4'
                placeholder="Enter tags separated by commas">
                </Input>


                <select
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="option1">Low</option>
                    <option value="option2">Medium</option>
                    <option value="option3">High</option>
                    <option value="option1">No Priority</option>
                </select>


                <Label htmlFor="password"><b>Task Description</b></Label>
               <textarea
               placeholder="Describe your task here..."
               spellCheck ='false'
               style={{ resize: 'none' }}
               className="flex w-full h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
               >
               </textarea>
               <div className="flex justify-end mb-4">
               <Button variant="default2">Save Changes</Button>
               </div>
 
            </Sidebar>
         </div>
        </>
    )
}
// gui-init end : abd
    return (
        <div className="bg-white rounded-lg shadow mx-auto max-w-4xl p-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
                My Tasks
            </h1>
            <br />
            <hr />
            <br />
            <div className="text-center mb-4">
                <Button>Create New Task</Button>
            </div>

            <table className="w-full">
                <thead>
                <tr className="border-b">
                    <th className="px-4 py-2 text-center">
                        <span className="flex items-center justify-center">Completed?</span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("title")}>
                                Task <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("project")}>
                                Project <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("dueDate")}>
                                Due Date <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2 text-center">
                            <span className="flex items-center justify-center cursor-pointer" onClick={() => handleSort("priority")}>
                                Priority <CaretSortIcon className="ml-1" />
                            </span>
                    </th>
                    <th className="px-4 py-2"></th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className="border-b last:border-b-0">
                        <td className="px-4 py-2 text-center">
                            <Checkbox id={`task-${task.id}`} checked={task.completed} />
                        </td>
                        <td className="px-4 py-2 text-center">{task.title}</td>
                        <td className="px-4 py-2 text-center">{task.project}</td>
                        <td className="px-4 py-2 text-center">{task.dueDate}</td>
                        <td className="px-4 py-2 text-center">{task.priority}</td>
                        <td className="px-4 py-2 text-center">
                            <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
