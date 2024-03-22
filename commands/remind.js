module.exports = {
  name: "remind",
  description: "Set a reminder",
  execute(message, args) {
    const [date, time, ...reminder_text] = args;
    const reminderDateTime = new Date(`${date} ${time}`);

    if (isNaN(reminderDateTime)) {
      message.channel.send(
        "Invalid date/time format. Please use DDMMYYYY HH:MM format."
      );
      return;
    }

    const currentDateTime = new Date();
    const timeDifference = reminderDateTime - currentDateTime;

    if (timeDifference <= 0) {
      message.channel.send("The reminder time must be in the future.");
      return;
    }

    setTimeout(() => {
      message.channel.send(`@everyone, Reminder: ${reminder_text.join(" ")}`);
    }, timeDifference);

    message.channel.send(
      `@everyone, I'll remind you on ${reminderDateTime.toLocaleString()}: ${reminder_text.join(
        " "
      )}`
    );
  },
};
