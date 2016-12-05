const DATE_FORMAT = "YYYY-MM-DD";
const oneDayInMs = moment.duration(1, "day").asMilliseconds();

export function daysInInterval (start, end) {
    const startMs = moment(start).startOf("day").valueOf();
    const endMs = moment(end).startOf("day").valueOf();
    const numberOfDays = (endMs - startMs) / oneDayInMs;
    const days = [];
    for (var i=0; i<=numberOfDays; i++) {
        days.push(
            moment(startMs).add(i, "days").format(DATE_FORMAT)
        );
    }
    return days;
}
