import chalk from 'chalk';

const maxSectionLength = 30;

export const logger = (section: string) => {
    return (...messages: unknown[]) => {
        const message = messages.join(" ");
        const time = new Date();
        const formattedTime = chalk.gray(
            `[${String(time.getHours()).padStart(2, '0')
            }:${String(time.getMinutes()).padStart(2, '0')
            }:${String(time.getSeconds()).padStart(2, '0')
            }:${String(time.getMilliseconds()).padStart(3, '0')
            }]`
        );

        const formattedSection = chalk.bold(`${chalk.magenta('[')}${chalk.blue(section.toUpperCase())}${chalk.magenta(']')}`);
        const padding = ' '.repeat(maxSectionLength - section.length);
        const logEntry = `${formattedTime}${formattedSection}${padding} ${message}`;
        console.log(logEntry)
    };
};
