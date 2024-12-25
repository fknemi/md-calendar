import { v4 as uuidv4 } from "uuid";
type Props = {};

interface Task {
    title: string;
    allDay: boolean;
    startTime: string;
    endTime: string;
    type: string;
    daysOfWeek: string[];
    startRecur: string;
}

export default function Calendar({}: Props) {
    const times = [
        "all-day",
        "12 AM",
        "1 AM",
        "2 AM",
        "3 AM",
        "4 AM",
        "5 AM",
        "6 AM",
        "7 AM",
        "8 AM",
        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM",
        "7 PM",
        "8 PM",
        "9 PM",
        "10 PM",
        "11 PM",
    ];

    const formatDate = (nextDate: Date) => {
        const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "numeric" };
        return nextDate.toLocaleDateString("en-US", options).replace(",", "");
    };

    const next7Days = Array.from({ length: 7 }, (_, i) => {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + i);
        return formatDate(nextDate);
    });

    const tasks: Task[] = [
        {
            title: "10:30 11:00",
            allDay: false,
            startTime: "22:30",
            endTime: "23:00",
            type: "recurring",
            daysOfWeek: ["S", "F"],
            startRecur: "12/11/2024",
        },
        {
            title: "08:30 09:00",
            allDay: false,
            startTime: "08:30",
            endTime: "09:00",
            type: "normal",
            daysOfWeek: ["S", "F"],
            startRecur: "12/11/2024",
        },

        {
            title: "02:00 4:00",
            allDay: false,
            startTime: "14:00",
            endTime: "16:00",
            type: "normal",
            daysOfWeek: ["S", "F"],
            startRecur: "12/11/2024",
        },
    ];
    const getPositionForTask = (task: Task) => {
        if (!task.allDay && (!task.startTime || !task.endTime)) {
            return null;
        }

        if (task.allDay) {
            return { start: 0, end: 0 };
        }

        let startHour = task.startTime.split(":").map(Number);
        let endHour = task.endTime.split(":").map(Number);

        let startFractionalHour = startHour[0] + startHour[1] / 60;
        let endFractionalHour = endHour[0] + endHour[1] / 60;

        const totalHours = 24;

        const totalRows = 26;

        let startRow = (startFractionalHour / totalHours) * (totalRows - 1); // exclude "all-day"
        let endRow = (endFractionalHour / totalHours) * (totalRows - 1);

        startRow = Math.min(Math.max(startRow, 1), totalRows - 1);
        endRow = Math.min(Math.max(endRow, 1), totalRows - 1);

        if (endRow <= startRow) {
            endRow = startRow + 1;
        }
        if (startRow >= 20) {
            startRow += 2
        }
        if (endRow >= 20) {
endRow -=2
        }
        console.log("startRow", startRow)
        console.log("endRow", endRow)
        // Return the computed start and end row positions
        return { start: startRow, end: endRow };
    };

    return (
        <div className="calendar-container w-full h-full border-2 borer-red-600 grid grid-rows-26 grid-cols-8 border-4 border-red-500">
            {next7Days.map((day, index) => (
                <div
                    className={`row-span-1 border-2 border-green-600 `}
                    key={uuidv4()}
                    style={{
                        gridColumnStart: index + 2,
                        gridColumnEnd: index + 2,
                    }}
                >
                    {day}
                </div>
            ))}

            {tasks.map(({ title, allDay, startTime, endTime, type, daysOfWeek, startRecur }) => {
                console.log(title)
                const row = getPositionForTask({ allDay, startTime, endTime } as Task);

                if (type === "recurring") {
                    const filteredDays = next7Days.filter((day) => {
                        const dayAbbr = day.split(" ")[0].slice(0, 2);
                        return !daysOfWeek.some((dayOfWeek) => dayAbbr.includes(dayOfWeek.slice(0, 2)));
                    });

                    const filteredIndices = filteredDays.map((filteredDay) => next7Days.indexOf(filteredDay));
                    console.log("margin", row.start - Math.floor(row.start))

                    return filteredIndices.map((i) => (
                        <div
                            key={uuidv4()}
                            className=" bg-red-400 relative "
                            style={{
                                gridColumnStart: i + 2,
                                gridColumnEnd: i + 3,
                                gridRowStart: Math.trunc(row.start + 3),
                                gridRowEnd: Math.trunc(row.end + 4),
                              //  marginTop: -(row.start - Math.floor(row.start)),
                            }}
                        >
                            <div>
                                <h2>{title}</h2>
                                <span>{type}</span>
                            </div>
                        </div>
                    ));
                } else {
                    return (
                        <div
                            key={uuidv4()}
                            className=" bg-red-400 relative overflow-hidden"
                            style={{
                                gridColumnStart: 2,
                                gridColumnEnd: 2,
                                gridRowStart: Math.trunc(row.start + 3),
                                gridRowEnd: Math.trunc(row.end + 4),
                                marginTop: ``, // TODO: Fix Size Reduction So It is on the MM position size
                            }}
                        >
                            <div>
                                <h2>{title}</h2>
                                <span>{type}</span>
                            </div>
                        </div>
                    );
                }
            })}

            {times.map((time, index) => {
                return (
                    <div
                        className={`border-2 border-gray-400 col-span-1 ${time === "all-day" ? "all-day" : ""}`}
                        style={{ gridRowStart: index + 2, gridRowEnd: index + 2 }}
                        key={uuidv4()}
                    >
                        {time}
                    </div>
                );
            })}
        </div>
    );
}
