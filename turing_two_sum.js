import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const isValidUnaryInput = (val) => {
    return /^1+01+$/.test(val)
};

const BLANK = "_";

const transitions = {
    // Проходим первое число
    "q0,1": ["1", "R", "q0"],

    // Заменяем разделитель на единицу
    "q0,0": ["1", "R", "q1"],

    // Проходим второе число
    "q1,1": ["1", "R", "q1"],

    // Дошли до конца ленты: возвращаемся на последнюю единицу
    "q1,_": ["_", "L", "q2"],

    // Удаляем одну лишнюю единицу и останавливаемся
    "q2,1": ["_", "N", "qH"],
};

const turingMachine = (input) => {
    if (!isValidUnaryInput(input)) {
        throw new Error("Введите два положительных числа в унарной системе, разделённые нулём.");
    }

    const tape = [...input];
    let head = 0;
    let state = "q0";
    let steps = 0;

    while (state !== "qH") {
        const symbol = tape[head] ?? BLANK;
        const rule = transitions[`${state},${symbol}`];

        if (!rule) {
            throw new Error(
                `Нет правила для состояния ${state} и символа ${symbol}`
            );
        }

        const [write, move, nextState] = rule;

        // Запись символа на ленту
        tape[head] = write;

        // Перемещение головки
        if (move === "R") head++;
        if (move === "L") head--;

        state = nextState;
        steps++;
    }

    // Считываем результат с ленты после остановки машины
    const result = tape.join("").replace(/_+$/, "");

    return { result, steps };
}

// запрашиваем ввод
const rl = readline.createInterface({ input, output });
const answer = await rl.question("Введите два числа в унарной системе счисления. В качестве разделителя используется символ 0: ");
rl.close();
const { result, steps } = turingMachine(answer);

console.log("Вход:", answer);
console.log("Результат:", result);
console.log("Сумма:", result.length - 1);
console.log("Количество шагов:", steps);
