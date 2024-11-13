import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Sidebar } from "@/components/ui/sidebar";
import { Label } from "@radix-ui/react-label";
import { Trash2 } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import '../styles/dropdown.css';
import { DialogDemo } from "@/components/Dialog.jsx";
import { useParams } from "react-router-dom";

const priorityOrder = {
    Low: 1,
    Medium: 2,
    High: 3,
};

const initialTasks = [
    {
        id: "task-1",
        completed: 0,
        title: "Complete report",
        projectId: "1",
        dueDate: "2024-10-20",
        priority: "Low",
    }
];

const initialProjects = [
    {
        description: "This description just got updated",
        id: 1,
        name: "Not my first rodeo"
    }
];

export default function ProjectPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [projects, setProjects] = useState(initialProjects);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [currentTaskTitle, setCurrentTaskTitle] = useState("Task Title");
    const [editMode, isEditMode] = useState(false);
    const [deletePopup, setDeletePopup] = useState({ isOpen: false, taskId: null });
    const [currentProject, setCurrentProject] = useState(null);
    let { projectID } = useParams();
    projectID = +projectID;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/projects');
                if (response.ok) {
                    const projectData = await response.json();
                    setProjects(projectData);
                } else {
                    console.error("Failed to fetch projects:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        const fetchTasks = async () => {
            try {
                if (!(await fetch('/auth')).ok) {
                    window.location.replace('/login');
                    return;
                }

                const response = await fetch(`/tasks`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedTasks = data.map(task => ({
                        id: task.id,
                        completed: task.status,
                        title: task.name,
                        projectId: task.projectId,
                        dueDate: task.dueDate || 'No Due Date',
                        priority: task.priority || 'Medium',
                    }));
                    setTasks(formattedTasks);
                } else {
                    console.error('Failed to fetch tasks:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchProjects();
        fetchTasks();
    }, [projectID]);

    useEffect(() => {
        const selectedProject = projects.find(project => project.id === projectID);
        setCurrentProject(selectedProject || { name: "Unknown Project" });
    }, [projects, projectID]);


    const handleDeletePopup = (action, taskId) => {
        setDeletePopup({ isOpen: false, taskId: null });
        if (action === "delete") {
            deleteTask(taskId);
        }
    };

    const resetTaskFields = () => {
        isEditMode(true);
        setCurrentTaskTitle('');
        document.getElementById("projects-option").value = "1";
        document.getElementById("date-option").value = "";
        document.getElementById("priority-option").value = "Low";
        document.getElementById("repeat-option").value = "Never";
        document.getElementById("descriptionBox").value = "";
    };

    const addNewTask = async () => {
        const newTask = {
            name: currentTaskTitle,
            description: document.getElementById('descriptionBox').value,
            status: 1,
            projectId: +document.getElementById('projects-option').value,
            dueDate: document.getElementById('date-option').value,
            priority: document.getElementById('priority-option').value,
        };

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                const createdTask = await response.json();
                const formattedTask = {
                    id: createdTask.id,
                    completed: createdTask.status === 1,
                    title: createdTask.name,
                    projectId: createdTask.projectId,
                    dueDate: createdTask.dueDate,
                    priority: createdTask.priority,
                };
                setTasks((prevTasks) => [...prevTasks, formattedTask]);
            }
        } catch (error) {
            console.error('Error adding new task:', error);
        }
    };

    const deleteTask = async (taskId) => {
        console.log('task to be deleted: ' + taskId);
        try {
            const response = await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
            if (response.ok) {
                setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } else {
                console.error(`Error deleting task ${taskId}`, response.statusText);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };


    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedTasks = [...tasks].sort((a, b) => {
            if (key === "priority") {
                return direction === "asc"
                    ? priorityOrder[a.priority] - priorityOrder[b.priority]
                    : priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return direction === "asc" ? (a[key] < b[key] ? -1 : 1) : (a[key] > b[key] ? -1 : 1);
        });
        setTasks(sortedTasks);
    };

    const filteredTasks = tasks.filter(task => task.projectId === projectID);
    console.log(projectID)
    console.log(filteredTasks)
    return (
        <>
            <DialogDemo
                onAction={(action) => handleDeletePopup(action, deletePopup.taskId)}
                isOpen={deletePopup.isOpen}
            />
            <Sidebar
                id="title-option"
                title={currentTaskTitle}
                setTitleInParent={setCurrentTaskTitle}
                editMode={editMode}
                isEditMode={isEditMode}
            >
                <select
                    id="projects-option"
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    {projects.map((project) => (
                        <option key={project.id} value={project.id} className="flex flex-col">
                            {project.name}
                        </option>
                    ))}
                </select>

                <input
                    id="date-option"
                    type="date"
                    className="flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 mb-4"
                >
                </input>

                <select
                    id="repeat-option"
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="Never">Repeats Never</option>
                    <option value="option2">To be determined</option>
                    <option value="option3">To be determined</option>
                    <option value="option1">To be determined</option>
                </select>

                <select
                    id="priority-option"
                    className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-black mb-4"
                >
                    <option value="0">Low</option>
                    <option value="1">Medium</option>
                    <option value="2">High</option>
                    <option value="None">No Priority</option>
                </select>

                <Label htmlFor="descriptionBox"><b>Task Description</b></Label>
                <textarea
                    id="descriptionBox"
                    placeholder="Describe your task here..."
                    spellCheck="false"
                    style={{resize: 'none'}}
                    className="flex w-full h-60 rounded-md border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-black bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:font-light placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 mb-4"
                />
                <div className="flex justify-end mb-4">
                    <Button variant="default2" onClick={addNewTask}>Save Changes</Button>
                </div>
            </Sidebar>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow mx-auto max-w-4xl p-6">
                <h1 className="text-left pb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {currentProject?.name }
                </h1>
                <br />
                <hr />
                <br />
                <div className="text-left mb-4">
                    <Button onClick={resetTaskFields}>Create New Task</Button>
                </div>

                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="px-4 py-2 text-center">Completed?</th>
                        <th className="px-4 py-2 text-center" onClick={() => handleSort("title")}>
                            Task <CaretSortIcon />
                        </th>
                        <th className="px-4 py-2 text-center" onClick={() => handleSort("dueDate")}>
                            Due Date <CaretSortIcon />
                        </th>
                        <th className="px-4 py-2 text-center" onClick={() => handleSort("priority")}>
                            Priority <CaretSortIcon />
                        </th>
                        <th className="px-4 py-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task.id} className="border-b last:border-b-0">
                            <td className="px-4 py-2 text-center">
                                <Checkbox id={`task-${task.id}`} checked={task.completed} />
                            </td>
                            <td className="px-4 py-2 text-center">{task.title}</td>
                            <td className="px-4 py-2 text-center">{task.dueDate}</td>
                            <td className="px-4 py-2 text-center">{task.priority}</td>
                            <td className="px-4 py-2 text-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeletePopup({ isOpen: true, taskId: task.id })}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
