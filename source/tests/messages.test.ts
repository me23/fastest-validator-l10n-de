"use strict";

const Validator = require("fastest-validator");
const {messages} = require('../index'); 
const v = new Validator({messages});

describe("Test rule: any", () => {

	it("should give back true anyway", () => {
		const check = v.compile({ $$root: true, type: "any" });

		expect(check(null)).toEqual([{ type: "required", actual: null, message: "Das Feld '' wird benötigt." }]);
		expect(check(undefined)).toEqual([{ type: "required", actual: undefined, message: "Das Feld '' wird benötigt." }]);
	});
	
});

describe("Test rule: array", () => {

	it("should check type of value", () => {
		let check = v.compile({ $$root: true, type: "array" });
		expect(check(0)).toEqual([{ type: "array", actual: 0, message: "Das Feld '' muss ein Array sein."}]);

		check = v.compile({ $$root: true, type: "array", empty: false });
		expect(check([])).toEqual([{ type: "arrayEmpty", actual: [], message: "Das Feld '' darf kein leeres Array sein." }]);

		check = v.compile({ $$root: true, type: "array", min: 3 });
		expect(check([])).toEqual([{ type: "arrayMin", expected: 3, actual: 0, message: "Das Feld '' muss mindestens 3 Einträge beinhalten." }]);

		check = v.compile({ $$root: true, type: "array", max: 3 });
		expect(check([1, 2, 3, 4])).toEqual([{ type: "arrayMax", expected: 3, actual: 4, message: "Das Feld '' muss 3 oder weniger Einträge beinhalten." }]);

		check = v.compile({ $$root: true, type: "array", length: 2 });
		expect(check([1, 2, 3, 4])).toEqual([{ type: "arrayLength", expected: 2, actual: 4, message: "Das Feld '' muss 2 Einträge beinhalten." }]);
		
		check = v.compile({ $$root: true, type: "array", contains: "bob" });
		expect(check([])).toEqual([{ type: "arrayContains", expected: "bob", actual: [], message: "Das Feld '' muss den Eintrag 'bob' beinhalten." }]);

		check = v.compile({ $$root: true, type: "array", contains: 5 });
		expect(check([])).toEqual([{ type: "arrayContains", expected: 5, actual: [], message: "Das Feld '' muss den Eintrag '5' beinhalten." }]);
		
		check = v.compile({ $$root: true, type: "array", unique: true });
		expect(check(["bob", "john", "bob"])).toEqual([{ type: "arrayUnique", expected: ["bob"], actual: ["bob", "john", "bob"], message: "Der Wert 'bob' darf im Feld '' nur einmal vorkommen: 'bob,john,bob'." }]);
		
		check = v.compile({ $$root: true, type: "array", enum: ["male", "female"] });
		expect(check(["human"])).toEqual([{ type: "arrayEnum", actual: "human", expected: "male, female", message: "Der Wert 'human' im Feld '' entspricht nicht einen dieser Werte: 'male, female'." }]);
		
		check = v.compile({ $$root: true, type: "array", items: "string" });
		expect(check(["male", 3, "female", true])).toEqual([
			{ type: "string", field: "[1]", actual: 3, message: "Das Feld '[1]' muss ein Text sein." },
			{ type: "string", field: "[3]", actual: true, message: "Das Feld '[3]' muss ein Text sein." }
		]);
	});
});

describe("Test rule: boolean", () => {

	it("should check values", () => {
		const check = v.compile({ $$root: true, type: "boolean" });
		expect(check(0)).toEqual([{ type: "boolean", actual: 0, message: "Das Feld '' muss ein boolischer Wert sein." }]);
	});
});

describe("Test rule: date", () => {

	it("should check values", () => {
		let check = v.compile({ $$root: true, type: "date" });
		expect(check(0)).toEqual([{ type: "date", actual: 0, message: "Das Feld '' muss ein Datum sein." }]);
	});
});

describe("Test rule: email", () => {

	it("should check values", () => {
		const check = v.compile({ $$root: true, type: "email" });
		expect(check(0)).toEqual([{ type: "string", actual: 0, message: "Das Feld '' muss ein Text sein." }]);
		expect(check("")).toEqual([{ type: "emailEmpty", actual: "", message: "Das Feld '' darf nicht leer sein." }]);
		expect(check("true")).toEqual([{ type: "email", actual: "true", message: "Das Feld '' muss eine gültige E-Mail-Adresse sein." }]);
	});
});

describe("Test rule: enum", () => {

	it("check enum", () => {
		const check = v.compile({ $$root: true, type: "enum", values: ["male", "female"] });

		expect(check("")).toEqual([{ type: "enumValue", expected: "male, female", actual: "", message: "Das Feld '' entspricht keinen der erlaubten Werte: 'male, female'." }]);
	});
});

describe("Test rule: equal", () => {

	it("should value equals to other field", () => {
		const check = v.compile({ confirm: { type: "equal", field: "pass" } });
		expect(check({ confirm: "abcd"})).toEqual([{ type: "equalField", field: "confirm", actual: "abcd", expected: "pass", message: "Das Feld 'confirm' muss dem 'pass' Feld entsprechen." }]);
	});
});

describe("Test rule: forbidden", () => {

	it("should check values", () => {
		const check = v.compile({ $$root: true, type: "forbidden" });
		expect(check(0)).toEqual([{ type: "forbidden", actual: 0, message: "Das Feld '' ist nicht erlaubt." }]);
	});
});

describe("Test rule: function", () => {

	it("should check values", () => {
		const check = v.compile({ $$root: true, type: "function" });
		expect(check(0)).toEqual([{ type: "function", actual: 0, message: "Das Feld '' muss eine Funktion sein." }]);
	});
});

describe("Test rule: luhn", () => {

	it("should check type of value", () => {
		const check = v.compile({ $$root: true, type: "luhn" });
		expect(check("")).toEqual([{ type: "luhn", actual: "", message: "Das Feld '' muss eine gültige Checksum sein." }]);
	});
});

describe("Test rule: mac", () => {

	it("should check type of value", () => {
		const check = v.compile({ $$root: true, type: "mac" });
		expect(check("")).toEqual([{ type: "mac", actual: "", message: "Das Feld '' muss eine gültige MAC-Adresse beinhalten." }]);
	});
});

describe("Test rule: number", () => {

	it("should check type of value", () => {
		let check = v.compile({ $$root: true, type: "number" });
		expect(check("")).toEqual([{ type: "number", actual: "", message: "Das Feld '' muss eine Nummer sein." }]);

		check = v.compile({ $$root: true, type: "number", min: 5});
		expect(check(3)).toEqual([{ type: "numberMin", expected: 5, actual: 3, message: "Das Feld '' muss größer oder gleich 5 sein." }]);

		check = v.compile({ $$root: true, type: "number", max: 5});
		expect(check(8)).toEqual([{ type: "numberMax", expected: 5, actual: 8, message: "Das Feld '' muss kleiner oder gleich 5 sein." }]);

		check = v.compile({ $$root: true, type: "number", equal: 123 });
		expect(check(8)).toEqual([{ type: "numberEqual", expected: 123, actual: 8, message: "Das Feld '' muss gleich 123 sein." }]);

		check = v.compile({ $$root: true, type: "number", notEqual: 123 });
		expect(check(123)).toEqual([{ type: "numberNotEqual", expected: 123, actual: 123, message: "Das Feld '' darf nicht gleich 123 sein." }]);

		check = v.compile({ $$root: true, type: "number", integer: true });
		expect(check(8.5)).toEqual([{ type: "numberInteger", actual: 8.5, message: "Das Feld '' muss eine Ganzzahl sein." }]);

		check = v.compile({ $$root: true, type: "number", positive: true });
		expect(check(-5.5)).toEqual([{ type: "numberPositive", actual: -5.5, message: "Das Feld '' muss eine positive Zahl sein." }]);

		check = v.compile({ $$root: true, type: "number", negative: true });
		expect(check(5.5)).toEqual([{ type: "numberNegative", actual: 5.5, message: "Das Feld '' muss eine negative Zahl sein." }]);
	});
});

describe("Test rule: object", () => {

	it("should check values", () => {
		let check = v.compile({ $$root: true, type: "object" });
		expect(check(0)).toEqual([{ type: "object", actual: 0, message:"Das Feld '' muss ein Objekt sein." }]);

		check = v.compile({ $$root: true, type: "object", strict: true, properties: {} });
		expect(check({ a: "John" })).toEqual([{ type: "objectStrict", actual: "a", expected: "", message: "Das Objekt '' beinhaltet verbotene Schlüssel: 'a'." }]);

		check = v.compile({ $$root: true, type: "object", properties: {
			"read-only": "boolean",
			"op.tional": { type: "string", optional: true }
		} });
		expect(check({})).toEqual([{ type: "required", field: "read-only", actual: undefined, message: "Das Feld 'read-only' wird benötigt." }]);

		check = v.compile({ $$root: true, type: "object", props: {
			optional_key_1: { type: "string", optional: true },
			optional_key_2: { type: "number", optional: true },
			optional_key_3: { type: "boolean", optional: true },
			optional_key_4: { type: "array", optional: true },
		}, minProps: 2 });
		expect(check({})).toEqual([{ type: "objectMinProps", actual: 0, expected: 2, message: "Das Objekt '' muss mindestens 2 Einträge beinhalten.", field: undefined }]);

		const checkNested = v.compile({
			key: { type: "object",
				props: {
					nested: {
						type: "object",
						props: {
							optional_key_1: { type: "string", optional: true },
							optional_key_2: { type: "number", optional: true },
						},
						minProps: 1
					}
				}
			},
		});
		expect(checkNested({ key: { nested: {} } })).toEqual([{ type: "objectMinProps", actual: 0, expected: 1, message: "Das Objekt 'key.nested' muss mindestens 1 Einträge beinhalten.", field: "key.nested" }]);
		
		check = v.compile({ $$root: true, type: "object", props: {
			optional_key_1: { type: "string", optional: true },
			optional_key_2: { type: "number", optional: true },
			optional_key_3: { type: "boolean", optional: true },
			optional_key_4: { type: "array", optional: true },
		}, maxProps: 2 });
		expect(check({ optional_key_1: "foobar", optional_key_2: 9, optional_key_3: true })).toEqual([{ type: "objectMaxProps", actual: 3, expected: 2, message: "Das Objekt '' darf nicht mehr als 2 Einträge beinhalten.", field: undefined }]);
		
		
	});
});

describe("Test rule: record", () => {

	it("should check values", () => {
		let check = v.compile({ $$root: true, type: "record" });
		expect(check(0)).toEqual([{ type: "record", actual: 0, message: "Das Feld '' muss ein Objekt sein." }]);
		
		check = v.compile({ $$root: true, type: "record", key: { type: "string", numeric: true } });
		expect(check({ nonNumeric: 3 })).toEqual([
			{ type: "stringNumeric", actual: "nonNumeric", field: "nonNumeric", message: "Das Feld 'nonNumeric' muss eine numerische Zeichenfolge sein." }
		]);
		
		check = v.compile({ $$root: true, type: "record", value: { type: "number" }});
		expect(check({ John: "Doe", Jane: 33 })).toEqual([
			{ type: "number", actual: "Doe", field: "John", message: "Das Feld 'John' muss eine Nummer sein." }
		]);
	
		check = v.compile({
			$$root: true,
			type: "record",
			key: { type: "string", alpha: true },
			value: { type: "string" }
		});
		expect(check({ John: "Doe", 1: 2 })).toEqual([
			{ type: "stringAlpha", actual: "1", field: "1", message: "Das Feld '1' muss eine alphabetische Zeichenfolge sein." },
			{ type: "string", actual: 2, field: "1", message: "Das Feld '1' muss ein Text sein." }
		]);
	});
});

describe("Test rule: string", () => {

	it("should check type of value", () => {
		let check = v.compile({ $$root: true, type: "string" });
		expect(check(0)).toEqual([{ type: "string", actual: 0, message:"Das Feld '' muss ein Text sein." }]);

		check = v.compile({ $$root: true, type: "string", empty: false });
		expect(check("")).toEqual([{ type: "stringEmpty", actual: "", message: "Das Feld '' darf nicht leer sein." }]);
		
		check = v.compile({ $$root: true, type: "string", pattern: "^fastest" });
		expect(check("")).toEqual([
			{ type: "stringPattern", actual: "", "expected": "/^fastest/", message: "Das Feld '' stimmt nicht mit dem benötigten Muster überein." },
		]);
	
		check = v.compile({ $$root: true, type: "string", min: 5 });
		expect(check("John")).toEqual([{ type: "stringMin", expected: 5, actual: 4, message: "Das Feld '' muss 5 Zeichen oder länger sein." }]);
	
		check = v.compile({ $$root: true, type: "string", max: 5 });
		expect(check("Icebob")).toEqual([{ type: "stringMax", expected: 5, actual: 6, message: "Das Feld '' muss 5 Zeichen oder kürzer sein." }]);
	
		check = v.compile({ $$root: true, type: "string", length: 6 });
		expect(check("John")).toEqual([{ type: "stringLength", expected: 6, actual: 4, message: "Das Feld '' muss 6 Zeichen lang sein." }]);

		check = v.compile({ $$root: true, type: "string", contains: "bob" });
		expect(check("John")).toEqual([{ type: "stringContains", expected: "bob", actual: "John", message: "Das Feld '' muss 'bob' enthalten." }]);
		
		check = v.compile({ $$root: true, type: "string", enum: ["male", "female"] });
		expect(check("")).toEqual([{ type: "stringEnum", expected: "male, female", actual: "", message:"Das Feld '' entspricht nicht einem der erlaubten Werten." }]);
		
		check = v.compile({ $$root: true, type: "string", enum: ["male", "female"], empty: true });
		expect(check("human")).toEqual([{ type: "stringEnum", expected: "male, female", actual: "human", message:"Das Feld '' entspricht nicht einem der erlaubten Werten." }]);

		check = v.compile({ $$root: true, type: "string", numeric: true});
		expect(check("123.1s0")).toEqual([{type: "stringNumeric", actual: "123.1s0", message:"Das Feld '' muss eine numerische Zeichenfolge sein." }]);

		check = v.compile({ $$root: true, type: "string", alpha: true});
		expect(check("3312")).toEqual([{type: "stringAlpha", actual: "3312", message: "Das Feld '' muss eine alphabetische Zeichenfolge sein." }]);


		check = v.compile({ $$root: true, type: "string", alphanum: true});
		expect(check("hello_world")).toEqual([{type: "stringAlphanum", actual: "hello_world", message:"Das Feld '' muss eine alpha-numerische Zeichenfolge sein." }]);

		check = v.compile({ $$root: true, type: "string", alphadash: true});
		expect(check("hello world")).toEqual([{type: "stringAlphadash", actual: "hello world", message: "Das Feld '' muss eine Zeichefolge mit Bindestrichen sein." }]);

		check = v.compile({ $$root: true, type: "string", hex: true});
		expect(check("abc")).toEqual([{type: "stringHex", actual: "abc", message: "Das Feld '' muss ein Hexadezimale Zeichenfolge sein." }]);

		check = v.compile({ $$root: true, type: "string", singleLine: true});
		expect(check("abc\n")).toEqual([{type: "stringSingleLine", message: "Das Feld '' darf nur aus einer Zeile bestehen." }]);

		check = v.compile({ $$root: true, type: "string", base64: true });
		expect(check("1342234")).toEqual([{"actual": "1342234", "field": undefined, "message": "Das Feld '' ein base64-codierte Zeichenfolge sein.", "type": "stringBase64"}]);
		
	});
});

describe("Test rule: tuple", () => {
	it("should check schema's 'items' field type", () => {
		const tupleCompile = (schema = {}) => () =>
			v.compile(Object.assign({ $$root: true, type: "tuple" }, schema));

		let message = "Invalid 'tuple' schema.";

		expect(tupleCompile({ items: 1 })).toThrow(message);
	
		message = "Invalid 'tuple' schema. The 'items' field must not be an empty array.";
		expect(tupleCompile({ items: [] })).toThrow(message);

		let check = v.compile({ $$root: true, type: "tuple" });
		expect(check(0)).toEqual([{ type: "tuple", actual: 0, message: "Das Feld '' muss ein Array sein." }]);

		check = v.compile({ $$root: true, type: "tuple", empty: false });
		message = "The '' field must not be an empty array.";
		expect(check([])).toEqual([
			{ type: "tupleEmpty", actual: [], message: "Das Feld '' darf kein leeres Array sein." }
		]);
	});
});

describe("Test rule: url", () => {
	const check = v.compile({ $$root: true, type: "url" });
	expect(check("true")).toEqual([{ type: "url", actual: "true", message: "Das Feld '' muss eine gültige URL sein." }]);
});

describe("Test rule: uuid", () => {

	it("should check type of value", () => {
		let check = v.compile({ $$root: true, type: "uuid" });
		expect(check("")).toEqual([{ type: "uuid", actual: "", message: "Das Feld '' muss eine gültige UUID sein." }]);

		check = v.compile({ $$root: true, type: "uuid", version: 0 });
		expect(check("00000000-0000-1000-0000-000000000000")).toEqual([{"actual": 1, "expected": 0, "type": "uuidVersion", message: "Das Feld '' muss eine gültige UUID der angegebenen Version beinhalten."}]);
	});
});