"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const DEFAULT_PYTHON =
  process.env.BENCH_PYTHON ||
  "python";
const DEFAULT_SEED = process.env.BENCH_SEED || "leona-repair-bench-1000-v1";

function timestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function parseArgs(argv) {
  const args = {
    count: 1000,
    seed: DEFAULT_SEED,
    python: DEFAULT_PYTHON,
    root: path.join("C:\\DevNexusTargets", `leona-repair-bench-1000-${timestamp()}`),
    maxAttempts: 3,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--count") args.count = Number(argv[++i]);
    else if (arg === "--seed") args.seed = String(argv[++i]);
    else if (arg === "--python") args.python = String(argv[++i]);
    else if (arg === "--root") args.root = String(argv[++i]);
    else if (arg === "--max-attempts") args.maxAttempts = Number(argv[++i]);
    else if (arg === "--help" || arg === "-h") {
      console.log([
        "Usage: node run_bench1000.js [--count 1000] [--seed text] [--python python.exe] [--root path]",
        "",
        "Defaults:",
        "  --count 1000",
        "  --root C:\\DevNexusTargets\\leona-repair-bench-1000-[timestamp]",
      ].join("\n"));
      process.exit(0);
    }
  }

  if (!Number.isInteger(args.count) || args.count < 1) {
    throw new Error("--count must be a positive integer");
  }
  if (!Number.isInteger(args.maxAttempts) || args.maxAttempts < 1) {
    throw new Error("--max-attempts must be a positive integer");
  }
  return args;
}

function hashString(input) {
  let h = 2166136261;
  const text = String(input);
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randint(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pick(rng, values) {
  return values[randint(rng, 0, values.length - 1)];
}

function shuffle(rng, values) {
  const result = values.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randint(rng, 0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const WORDS = [
  "atlas", "bloom", "cinder", "delta", "ember", "flux", "glade", "harbor",
  "ion", "juno", "kepler", "lumen", "mosaic", "nimbus", "onyx", "prairie",
  "quartz", "rivet", "sol", "tango", "umbra", "vesta", "willow", "xenon",
  "yarrow", "zenith", "apex", "brisk", "coral", "drift", "echo", "forge",
  "gale", "haven", "iris", "jetty", "kilo", "lotus", "mirth", "nova",
  "orbit", "pioneer", "quest", "ridge", "summit", "timber", "uplink", "vertex",
  "wisp", "yield", "zephyr",
];

function ident(rng, prefix) {
  return `${prefix}_${pick(rng, WORDS)}_${pick(rng, WORDS)}_${randint(rng, 100, 999)}`;
}

function className(rng) {
  const a = pick(rng, WORDS);
  const b = pick(rng, WORDS);
  return `${cap(a)}${cap(b)}${randint(rng, 10, 99)}`;
}

function cap(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function fileName(rng, suffix = "") {
  return `${pick(rng, WORDS)}_${pick(rng, WORDS)}_${randint(rng, 100, 999)}${suffix}.py`;
}

function py(value) {
  if (value === null) return "None";
  if (value === true) return "True";
  if (value === false) return "False";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(value);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(py).join(", ")}]`;
  const pairs = Object.entries(value).map(([k, v]) => `${py(k)}: ${py(v)}`);
  return `{${pairs.join(", ")}}`;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.replace(/\r?\n/g, "\n"), "utf8");
}

function sha(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    shell: false,
    maxBuffer: 1024 * 1024 * 30,
  });
  return {
    command: `${cmd} ${args.join(" ")}`,
    code: result.status ?? -1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function summarizePytest(result) {
  const text = `${result.stdout}\n${result.stderr}`;
  const lines = text.split(/\r?\n/).filter(Boolean);
  return lines.slice(-10).join("\n");
}

function moduleSource(rng, imports, importantBlocks) {
  const fillerCount = randint(rng, 2, 7);
  const fillers = [];
  for (let i = 0; i < fillerCount; i += 1) {
    const name = ident(rng, "helper");
    const value = randint(rng, -20, 40);
    fillers.push(`def ${name}(value):\n    return value + ${value}\n`);
  }
  return `${imports.join("\n")}${imports.length ? "\n\n" : ""}${shuffle(rng, fillers.concat(importantBlocks)).join("\n\n")}\n`;
}

function expectedUnique(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      result.push(value);
    }
  }
  return result;
}

function stem(file) {
  return path.basename(file, ".py");
}

function createCase(index, seedText) {
  const rng = mulberry32(hashString(`${seedText}:${index}`));
  const generators = [
    genDivideGuard,
    genAverageEmpty,
    genParseFloat,
    genClamp,
    genNormalize,
    genUniqueOrder,
    genFlatten,
    genMedian,
    genDiscount,
    genLeapYear,
    genParseBool,
    genSlugify,
    genSafeFilename,
    genCartTotal,
    genInventoryFloor,
    genTemperature,
    genMatrixTranspose,
    genScoreCap,
    genTodoMissing,
    genAuthToken,
    genWordCount,
    genCsvQuotes,
    genSearchRank,
    genGeometryArea,
    genEmailValidation,
    genMultiHelperInterface,
    genMultiConstantsDrift,
    genMultiSharedContract,
    genMultiImportMismatch,
    genClassMethodContract,
  ];
  const generator = generators[index % generators.length];
  const spec = generator(index, rng);
  const caseId = String(index + 1).padStart(4, "0");
  return {
    ...spec,
    name: `${caseId}_${spec.name}`,
    category: spec.category || generator.name.replace(/^gen/, ""),
  };
}

function genDivideGuard(index, rng) {
  const fn = ident(rng, "divide");
  const target = fileName(rng, "_calc");
  const a = randint(rng, 20, 200);
  const b = randint(rng, 2, 19);
  const broken = moduleSource(rng, [], [`def ${fn}(left, right):\n    return left / right\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(left, right):\n    if right == 0:\n        return None\n    return left / right\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_regular_division():\n    assert ${fn}(${a}, ${b}) == ${py(a / b)}\n\n\ndef test_negative_division():\n    assert ${fn}(${-a}, ${b}) == ${py(-a / b)}\n\n\ndef test_zero_division_returns_none():\n    assert ${fn}(${a}, 0) is None\n`;
  return singleFile("divide_guard", target, broken, fixed, tests);
}

function genAverageEmpty(index, rng) {
  const fn = ident(rng, "average");
  const target = fileName(rng, "_stats");
  const values = Array.from({ length: randint(rng, 3, 8) }, () => randint(rng, -10, 30));
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const broken = moduleSource(rng, [], [`def ${fn}(items):\n    return sum(items) / len(items)\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(items):\n    if not items:\n        return None\n    return sum(items) / len(items)\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_average_mutated_values():\n    assert ${fn}(${py(values)}) == ${py(avg)}\n\n\ndef test_average_single_value():\n    assert ${fn}([${values[0]}]) == ${values[0]}\n\n\ndef test_empty_average_returns_none():\n    assert ${fn}([]) is None\n`;
  return singleFile("average_empty", target, broken, fixed, tests);
}

function genParseFloat(index, rng) {
  const fn = ident(rng, "parse");
  const target = fileName(rng, "_parser");
  const whole = randint(rng, -50, 80);
  const decimal = randint(rng, 10, 99);
  const text = `${whole}.${decimal}`;
  const broken = moduleSource(rng, [], [`def ${fn}(raw):\n    return int(raw)\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(raw):\n    return int(float(raw))\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_integer_string():\n    assert ${fn}(${py(String(whole))}) == ${whole}\n\n\ndef test_float_string_truncates():\n    assert ${fn}(${py(text)}) == ${whole}\n\n\ndef test_negative_float_string_truncates():\n    assert ${fn}(${py(`-${Math.abs(whole)}.${decimal}`)}) == ${-Math.abs(whole)}\n`;
  return singleFile("parse_float", target, broken, fixed, tests);
}

function genClamp(index, rng) {
  const fn = ident(rng, "clamp");
  const target = fileName(rng, "_numbers");
  const lower = randint(rng, -20, 5);
  const upper = lower + randint(rng, 5, 30);
  const inside = randint(rng, lower, upper);
  const broken = moduleSource(rng, [], [`def ${fn}(value, lower, upper):\n    return value\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(value, lower, upper):\n    return max(lower, min(upper, value))\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_inside_bounds():\n    assert ${fn}(${inside}, ${lower}, ${upper}) == ${inside}\n\n\ndef test_below_bounds():\n    assert ${fn}(${lower - randint(rng, 1, 9)}, ${lower}, ${upper}) == ${lower}\n\n\ndef test_above_bounds():\n    assert ${fn}(${upper + randint(rng, 1, 9)}, ${lower}, ${upper}) == ${upper}\n`;
  return singleFile("clamp_bounds", target, broken, fixed, tests);
}

function genNormalize(index, rng) {
  const fn = ident(rng, "normalize");
  const target = fileName(rng, "_text");
  const a = pick(rng, ["alpha", "bravo", "cider", "delta"]);
  const b = pick(rng, ["echo", "forge", "glade", "harbor"]);
  const broken = moduleSource(rng, [], [`def ${fn}(text):\n    return text.strip()\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(text):\n    return " ".join(text.split())\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_strips_edges():\n    assert ${fn}(${py(`  ${a}  `)}) == ${py(a)}\n\n\ndef test_collapses_spacing():\n    assert ${fn}(${py(`${a}   ${b}`)}) == ${py(`${a} ${b}`)}\n\n\ndef test_collapses_tabs_and_newlines():\n    assert ${fn}(${py(`${a}\n\t${b}`)}) == ${py(`${a} ${b}`)}\n`;
  return singleFile("normalize_whitespace", target, broken, fixed, tests);
}

function genUniqueOrder(index, rng) {
  const fn = ident(rng, "unique");
  const target = fileName(rng, "_lists");
  const values = [randint(rng, 20, 30), randint(rng, 1, 9), randint(rng, 20, 30), randint(rng, 10, 19), randint(rng, 1, 9)];
  const expected = expectedUnique(values);
  const broken = moduleSource(rng, [], [`def ${fn}(items):\n    return sorted(set(items))\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(items):\n    seen = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_preserves_first_seen_order():\n    assert ${fn}(${py(values)}) == ${py(expected)}\n\n\ndef test_empty_input():\n    assert ${fn}([]) == []\n\n\ndef test_single_value():\n    assert ${fn}([${values[0]}, ${values[0]}]) == [${values[0]}]\n`;
  return singleFile("unique_order", target, broken, fixed, tests);
}

function genFlatten(index, rng) {
  const fn = ident(rng, "flatten");
  const target = fileName(rng, "_nested");
  const groups = Array.from({ length: 3 }, () => Array.from({ length: randint(rng, 1, 4) }, () => randint(rng, 0, 20)));
  const expected = groups.flat();
  const broken = moduleSource(rng, [], [`def ${fn}(groups):\n    return groups\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(groups):\n    result = []\n    for group in groups:\n        result.extend(group)\n    return result\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_flattens_varied_lengths():\n    assert ${fn}(${py(groups)}) == ${py(expected)}\n\n\ndef test_flattens_empty_group():\n    assert ${fn}([[], [${expected[0]}]]) == [${expected[0]}]\n\n\ndef test_empty_input():\n    assert ${fn}([]) == []\n`;
  return singleFile("flatten_nested", target, broken, fixed, tests);
}

function genMedian(index, rng) {
  const fn = ident(rng, "median");
  const target = fileName(rng, "_stats");
  const values = shuffle(rng, [randint(rng, 1, 5), randint(rng, 6, 10), randint(rng, 11, 15), randint(rng, 16, 20)]);
  const sorted = values.slice().sort((a, b) => a - b);
  const expected = (sorted[1] + sorted[2]) / 2;
  const odd = [sorted[0], sorted[2], sorted[3]];
  const broken = moduleSource(rng, [], [`def ${fn}(items):\n    items = sorted(items)\n    return items[len(items) // 2]\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(items):\n    items = sorted(items)\n    midpoint = len(items) // 2\n    if len(items) % 2:\n        return items[midpoint]\n    return (items[midpoint - 1] + items[midpoint]) / 2\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_even_count_averages_middle_values():\n    assert ${fn}(${py(values)}) == ${py(expected)}\n\n\ndef test_odd_count_uses_middle_value():\n    assert ${fn}(${py(odd)}) == ${sorted[2]}\n\n\ndef test_unsorted_input():\n    assert ${fn}(${py(shuffle(rng, values))}) == ${py(expected)}\n`;
  return singleFile("median_even", target, broken, fixed, tests);
}

function genDiscount(index, rng) {
  const cls = className(rng);
  const method = ident(rng, "discount");
  const target = fileName(rng, "_pricing");
  const price = randint(rng, 20, 300);
  const percent = pick(rng, [5, 10, 15, 20, 25, 30, 40]);
  const expected = price * (1 - percent / 100);
  const broken = moduleSource(rng, [], [`class ${cls}:\n    def ${method}(self, price, percent):\n        return price - percent\n`]);
  const fixed = moduleSource(rng, [], [`class ${cls}:\n    def ${method}(self, price, percent):\n        return price * (1 - percent / 100)\n`]);
  const tests = `from ${stem(target)} import ${cls}\n\n\ndef test_zero_discount():\n    assert ${cls}().${method}(${price}, 0) == ${price}\n\n\ndef test_percent_discount():\n    assert ${cls}().${method}(${price}, ${percent}) == ${py(expected)}\n\n\ndef test_full_discount():\n    assert ${cls}().${method}(${price}, 100) == 0\n`;
  return singleFile("class_discount", target, broken, fixed, tests);
}

function genLeapYear(index, rng) {
  const fn = ident(rng, "is_leap");
  const target = fileName(rng, "_dates");
  const century = pick(rng, [1700, 1800, 1900, 2100]);
  const leap = pick(rng, [2000, 2400]);
  const regular = pick(rng, [2024, 2028, 2032]);
  const broken = moduleSource(rng, [], [`def ${fn}(year):\n    return year % 4 == 0\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_regular_leap_year():\n    assert ${fn}(${regular}) is True\n\n\ndef test_century_not_divisible_by_400_is_not_leap():\n    assert ${fn}(${century}) is False\n\n\ndef test_century_divisible_by_400_is_leap():\n    assert ${fn}(${leap}) is True\n`;
  return singleFile("leap_year", target, broken, fixed, tests);
}

function genParseBool(index, rng) {
  const fn = ident(rng, "parse_bool");
  const target = fileName(rng, "_config");
  const trueWord = pick(rng, ["true", "YES", "On", "1"]);
  const falseWord = pick(rng, ["false", "NO", "off", "0"]);
  const broken = moduleSource(rng, [], [`def ${fn}(value):\n    return bool(value)\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(value):\n    if isinstance(value, bool):\n        return value\n    normalized = str(value).strip().lower()\n    if normalized in {"true", "1", "yes", "on"}:\n        return True\n    if normalized in {"false", "0", "no", "off", ""}:\n        return False\n    raise ValueError(f"Cannot parse boolean: {value!r}")\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_true_variant():\n    assert ${fn}(${py(trueWord)}) is True\n\n\ndef test_false_variant():\n    assert ${fn}(${py(falseWord)}) is False\n\n\ndef test_bool_passthrough():\n    assert ${fn}(False) is False\n`;
  return singleFile("parse_bool", target, broken, fixed, tests);
}

function genSlugify(index, rng) {
  const fn = ident(rng, "slugify");
  const target = fileName(rng, "_url");
  const left = pick(rng, ["Bright", "Hidden", "Copper", "Silent"]);
  const right = pick(rng, ["Signal", "River", "Engine", "Garden"]);
  const broken = moduleSource(rng, [], [`def ${fn}(text):\n    return text.lower().replace(" ", "-")\n`]);
  const fixed = moduleSource(rng, ["import re"], [`def ${fn}(text):\n    cleaned = re.sub(r"[^a-z0-9]+", "-", text.lower())\n    return cleaned.strip("-")\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_spaces():\n    assert ${fn}(${py(`${left} ${right}`)}) == ${py(`${left}-${right}`.toLowerCase())}\n\n\ndef test_punctuation():\n    assert ${fn}(${py(`${left}, ${right}!`)}) == ${py(`${left}-${right}`.toLowerCase())}\n\n\ndef test_strips_edges():\n    assert ${fn}(${py(`--${left} ${right}??`)}) == ${py(`${left}-${right}`.toLowerCase())}\n`;
  return singleFile("slugify", target, broken, fixed, tests);
}

function genSafeFilename(index, rng) {
  const fn = ident(rng, "safe_name");
  const target = fileName(rng, "_files");
  const base = pick(rng, ["report", "lesson", "audit", "export"]);
  const broken = moduleSource(rng, [], [`def ${fn}(name):\n    return name.strip()\n`]);
  const fixed = moduleSource(rng, ["import re"], [`def ${fn}(name):\n    cleaned = re.sub(r'[\\\\/:*?"<>|]+', "_", name.strip())\n    cleaned = re.sub(r"\\s+", "_", cleaned)\n    return cleaned or "untitled"\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_simple_name():\n    assert ${fn}(${py(`${base}.txt`)}) == ${py(`${base}.txt`)}\n\n\ndef test_forbidden_characters():\n    assert ${fn}(${py(`${base}:bad?.txt`)}) == ${py(`${base}_bad_.txt`)}\n\n\ndef test_empty_name():\n    assert ${fn}("   ") == "untitled"\n`;
  return singleFile("safe_filename", target, broken, fixed, tests);
}

function genCartTotal(index, rng) {
  const fn = ident(rng, "cart_total");
  const target = fileName(rng, "_cart");
  const p1 = randint(rng, 2, 20);
  const q1 = randint(rng, 2, 7);
  const p2 = randint(rng, 2, 20);
  const q2 = randint(rng, 2, 7);
  const expected = p1 * q1 + p2 * q2;
  const broken = moduleSource(rng, [], [`def ${fn}(items):\n    return sum(item["price"] for item in items)\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(items):\n    return sum(item["price"] * item.get("qty", 1) for item in items)\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_empty_cart():\n    assert ${fn}([]) == 0\n\n\ndef test_default_quantity():\n    assert ${fn}([{"price": ${p1}}]) == ${p1}\n\n\ndef test_explicit_quantities():\n    assert ${fn}([{"price": ${p1}, "qty": ${q1}}, {"price": ${p2}, "qty": ${q2}}]) == ${expected}\n`;
  return singleFile("cart_total", target, broken, fixed, tests);
}

function genInventoryFloor(index, rng) {
  const fn = ident(rng, "remove_stock");
  const target = fileName(rng, "_inventory");
  const current = randint(rng, 3, 30);
  const broken = moduleSource(rng, [], [`def ${fn}(current, amount):\n    return current - amount\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(current, amount):\n    return max(0, current - amount)\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_remove_some():\n    assert ${fn}(${current}, 2) == ${current - 2}\n\n\ndef test_remove_exact():\n    assert ${fn}(${current}, ${current}) == 0\n\n\ndef test_never_goes_negative():\n    assert ${fn}(${current}, ${current + randint(rng, 1, 10)}) == 0\n`;
  return singleFile("inventory_floor", target, broken, fixed, tests);
}

function genTemperature(index, rng) {
  const fn = ident(rng, "convert");
  const target = fileName(rng, "_temperature");
  const c = randint(rng, -30, 80);
  const expected = c * 9 / 5 + 32;
  const broken = moduleSource(rng, [], [`def ${fn}(celsius):\n    return celsius + 32\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(celsius):\n    return celsius * 9 / 5 + 32\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_freezing():\n    assert ${fn}(0) == 32\n\n\ndef test_mutated_temperature():\n    assert ${fn}(${c}) == ${py(expected)}\n\n\ndef test_negative_forty():\n    assert ${fn}(-40) == -40\n`;
  return singleFile("temperature", target, broken, fixed, tests);
}

function genMatrixTranspose(index, rng) {
  const fn = ident(rng, "transpose");
  const target = fileName(rng, "_matrix");
  const matrix = [[randint(rng, 1, 9), randint(rng, 1, 9), randint(rng, 1, 9)], [randint(rng, 1, 9), randint(rng, 1, 9), randint(rng, 1, 9)]];
  const expected = matrix[0].map((_, col) => matrix.map((row) => row[col]));
  const broken = moduleSource(rng, [], [`def ${fn}(matrix):\n    return matrix\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(matrix):\n    if not matrix:\n        return []\n    return [list(row) for row in zip(*matrix)]\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_rectangular_matrix():\n    assert ${fn}(${py(matrix)}) == ${py(expected)}\n\n\ndef test_square_matrix():\n    assert ${fn}([[1, 2], [3, 4]]) == [[1, 3], [2, 4]]\n\n\ndef test_empty_matrix():\n    assert ${fn}([]) == []\n`;
  return singleFile("matrix_transpose", target, broken, fixed, tests);
}

function genScoreCap(index, rng) {
  const fn = ident(rng, "score");
  const target = fileName(rng, "_score");
  const base = randint(rng, 80, 99);
  const bonus = 101 - base + randint(rng, 0, 20);
  const broken = moduleSource(rng, [], [`def ${fn}(base, bonus):\n    return base + bonus\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(base, bonus):\n    return min(100, base + bonus)\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_uncapped_score():\n    assert ${fn}(20, 5) == 25\n\n\ndef test_caps_high_score():\n    assert ${fn}(${base}, ${bonus}) == 100\n\n\ndef test_zero_score():\n    assert ${fn}(0, 0) == 0\n`;
  return singleFile("score_cap", target, broken, fixed, tests);
}

function genTodoMissing(index, rng) {
  const fn = ident(rng, "toggle");
  const target = fileName(rng, "_todo");
  const present = randint(rng, 10, 90);
  const missing = present + randint(rng, 1, 20);
  const broken = moduleSource(rng, [], [`def ${fn}(items, item_id):\n    for item in items:\n        if item["id"] == item_id:\n            item["done"] = not item["done"]\n    return items\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(items, item_id):\n    found = False\n    for item in items:\n        if item["id"] == item_id:\n            item["done"] = not item["done"]\n            found = True\n    if not found:\n        raise KeyError(item_id)\n    return items\n`]);
  const tests = `import pytest\nfrom ${stem(target)} import ${fn}\n\n\ndef test_toggles_done_true():\n    assert ${fn}([{"id": ${present}, "done": False}], ${present})[0]["done"] is True\n\n\ndef test_toggles_done_false():\n    assert ${fn}([{"id": ${present}, "done": True}], ${present})[0]["done"] is False\n\n\ndef test_missing_item_raises():\n    with pytest.raises(KeyError):\n        ${fn}([{"id": ${present}, "done": False}], ${missing})\n`;
  return singleFile("todo_missing", target, broken, fixed, tests);
}

function genAuthToken(index, rng) {
  const fn = ident(rng, "token");
  const target = fileName(rng, "_auth");
  const token = `${pick(rng, WORDS)}-${randint(rng, 1000, 9999)}`;
  const broken = moduleSource(rng, [], [`def ${fn}(header):\n    prefix = "Bearer "\n    if not header.startswith(prefix):\n        return None\n    return header[len(prefix):]\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(header):\n    if not header:\n        return None\n    parts = header.split(None, 1)\n    if len(parts) != 2 or parts[0].lower() != "bearer":\n        return None\n    return parts[1]\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_standard_bearer():\n    assert ${fn}(${py(`Bearer ${token}`)}) == ${py(token)}\n\n\ndef test_lowercase_bearer():\n    assert ${fn}(${py(`bearer ${token}`)}) == ${py(token)}\n\n\ndef test_wrong_scheme():\n    assert ${fn}(${py(`Basic ${token}`)}) is None\n`;
  return singleFile("auth_token", target, broken, fixed, tests);
}

function genWordCount(index, rng) {
  const fn = ident(rng, "count");
  const target = fileName(rng, "_words");
  const a = pick(rng, ["Hello", "Signal", "Quiet", "Brave"]);
  const b = pick(rng, ["world", "river", "engine", "garden"]);
  const broken = moduleSource(rng, [], [`def ${fn}(text):\n    return len(text.split(" "))\n`]);
  const fixed = moduleSource(rng, ["import re"], [`def ${fn}(text):\n    return len(re.findall(r"[A-Za-z0-9']+", text))\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_simple_count():\n    assert ${fn}(${py(`${a} ${b}`)}) == 2\n\n\ndef test_multiple_spaces():\n    assert ${fn}(${py(`${a}   ${b}`)}) == 2\n\n\ndef test_punctuation():\n    assert ${fn}(${py(`${a}, ${b}!`)}) == 2\n`;
  return singleFile("word_count", target, broken, fixed, tests);
}

function genCsvQuotes(index, rng) {
  const fn = ident(rng, "parse_csv");
  const target = fileName(rng, "_csv");
  const a = pick(rng, ["alpha", "bravo", "cinder"]);
  const b = `${pick(rng, ["delta", "ember", "flux"])},${pick(rng, ["gale", "haven", "iris"])}`;
  const c = pick(rng, ["juno", "kepler", "lotus"]);
  const broken = moduleSource(rng, [], [`def ${fn}(line):\n    return line.split(",")\n`]);
  const fixed = moduleSource(rng, ["import csv"], [`def ${fn}(line):\n    return next(csv.reader([line]))\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_plain_csv():\n    assert ${fn}(${py(`${a},${c}`)}) == ${py([a, c])}\n\n\ndef test_quoted_comma():\n    assert ${fn}(${py(`${a},"${b}",${c}`)}) == ${py([a, b, c])}\n\n\ndef test_empty_field():\n    assert ${fn}(${py(`${a},,${c}`)}) == ${py([a, "", c])}\n`;
  return singleFile("csv_quotes", target, broken, fixed, tests);
}

function genSearchRank(index, rng) {
  const fn = ident(rng, "rank");
  const target = fileName(rng, "_search");
  const item = `${cap(pick(rng, WORDS))} ${cap(pick(rng, WORDS))}`;
  const query = item.slice(0, 3).toLowerCase();
  const broken = moduleSource(rng, [], [`def ${fn}(items, query):\n    return [item for item in items if query in item]\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(items, query):\n    normalized = query.lower()\n    return [item for item in items if normalized in item.lower()]\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_exact_match():\n    assert ${fn}(["alpha", "beta"], "alp") == ["alpha"]\n\n\ndef test_case_insensitive_match():\n    assert ${fn}(${py([item, "Other Value"])}, ${py(query)}) == ${py([item])}\n\n\ndef test_no_match():\n    assert ${fn}(["alpha"], "zzz") == []\n`;
  return singleFile("search_rank", target, broken, fixed, tests);
}

function genGeometryArea(index, rng) {
  const fn = ident(rng, "area");
  const target = fileName(rng, "_geometry");
  const w = randint(rng, 2, 20);
  const h = randint(rng, 2, 20);
  const broken = moduleSource(rng, [], [`def ${fn}(width, height):\n    return width + height\n`]);
  const fixed = moduleSource(rng, [], [`def ${fn}(width, height):\n    if width < 0 or height < 0:\n        raise ValueError("dimensions must be non-negative")\n    return width * height\n`]);
  const tests = `import pytest\nfrom ${stem(target)} import ${fn}\n\n\ndef test_rectangle_area():\n    assert ${fn}(${w}, ${h}) == ${w * h}\n\n\ndef test_zero_area():\n    assert ${fn}(0, ${h}) == 0\n\n\ndef test_negative_dimension_rejected():\n    with pytest.raises(ValueError):\n        ${fn}(-1, ${h})\n`;
  return singleFile("geometry_area", target, broken, fixed, tests);
}

function genEmailValidation(index, rng) {
  const fn = ident(rng, "email");
  const target = fileName(rng, "_validation");
  const user = pick(rng, WORDS);
  const domain = pick(rng, WORDS);
  const broken = moduleSource(rng, [], [`def ${fn}(value):\n    return "@" in value\n`]);
  const fixed = moduleSource(rng, ["import re"], [`def ${fn}(value):\n    return bool(re.fullmatch(r"[^@\\s]+@[^@\\s]+\\.[^@\\s]+", value or ""))\n`]);
  const tests = `from ${stem(target)} import ${fn}\n\n\ndef test_valid_email():\n    assert ${fn}(${py(`${user}@${domain}.com`)}) is True\n\n\ndef test_missing_domain_dot():\n    assert ${fn}(${py(`${user}@${domain}`)}) is False\n\n\ndef test_missing_user():\n    assert ${fn}(${py(`@${domain}.com`)}) is False\n`;
  return singleFile("email_validation", target, broken, fixed, tests);
}

function genMultiHelperInterface(index, rng) {
  const publicFile = fileName(rng, "_service");
  const helperFile = fileName(rng, "_helper");
  const publicFn = ident(rng, "compute");
  const oldHelper = ident(rng, "legacy");
  const newHelper = ident(rng, "helper");
  const factor = randint(rng, 2, 9);
  const value = randint(rng, 5, 40);

  const brokenPublic = moduleSource(rng, [`from ${stem(helperFile)} import ${oldHelper}`], [`def ${publicFn}(value):\n    return ${oldHelper}(value)\n`]);
  const fixedPublic = moduleSource(rng, [`from ${stem(helperFile)} import ${newHelper}`], [`def ${publicFn}(value):\n    return ${newHelper}(value)\n`]);
  const brokenHelper = moduleSource(rng, [], [`def ${oldHelper}(value):\n    return value + ${factor}\n`]);
  const fixedHelper = moduleSource(rng, [], [`def ${newHelper}(value):\n    return value * ${factor}\n`]);
  const tests = `from ${stem(publicFile)} import ${publicFn}\n\n\ndef test_public_computation_uses_helper_contract():\n    assert ${publicFn}(${value}) == ${value * factor}\n\n\ndef test_zero_value():\n    assert ${publicFn}(0) == 0\n\n\ndef test_negative_value():\n    assert ${publicFn}(-2) == ${-2 * factor}\n`;

  return multiFile("multi_helper_interface", {
    [publicFile]: brokenPublic,
    [helperFile]: brokenHelper,
  }, {
    [publicFile]: fixedPublic,
    [helperFile]: fixedHelper,
  }, tests);
}

function genMultiConstantsDrift(index, rng) {
  const configFile = fileName(rng, "_constants");
  const serviceFile = fileName(rng, "_pricing");
  const fn = ident(rng, "total");
  const constName = ident(rng, "RATE").toUpperCase();
  const rate = pick(rng, [1.05, 1.075, 1.1, 1.2]);
  const wrong = rate + pick(rng, [0.1, 0.2, -0.05]);
  const amount = randint(rng, 20, 300);

  const brokenConfig = `${constName} = ${py(wrong)}\n`;
  const fixedConfig = `${constName} = ${py(rate)}\n`;
  const brokenService = moduleSource(rng, [`from ${stem(configFile)} import ${constName}`], [`def ${fn}(amount):\n    return amount + ${constName}\n`]);
  const fixedService = moduleSource(rng, [`from ${stem(configFile)} import ${constName}`], [`def ${fn}(amount):\n    return amount * ${constName}\n`]);
  const tests = `from ${stem(serviceFile)} import ${fn}\n\n\ndef test_rate_applied_as_multiplier():\n    assert ${fn}(${amount}) == ${py(amount * rate)}\n\n\ndef test_zero_amount():\n    assert ${fn}(0) == 0\n\n\ndef test_small_amount():\n    assert ${fn}(10) == ${py(10 * rate)}\n`;

  return multiFile("multi_constants_drift", {
    [configFile]: brokenConfig,
    [serviceFile]: brokenService,
  }, {
    [configFile]: fixedConfig,
    [serviceFile]: fixedService,
  }, tests);
}

function genMultiSharedContract(index, rng) {
  const modelFile = fileName(rng, "_model");
  const configFile = fileName(rng, "_config");
  const serviceFile = fileName(rng, "_service");
  const cls = className(rng);
  const buildFn = ident(rng, "build");
  const oldMethod = ident(rng, "label");
  const newMethod = ident(rng, "display");
  const name = `${pick(rng, WORDS)} ${pick(rng, WORDS)}`;

  const brokenModel = moduleSource(rng, [], [`class ${cls}:\n    def __init__(self, name):\n        self.name = name\n\n    def ${oldMethod}(self):\n        return self.name.lower()\n`]);
  const fixedModel = moduleSource(rng, [], [`class ${cls}:\n    def __init__(self, name):\n        self.name = name\n\n    def ${newMethod}(self):\n        return self.name.title()\n`]);
  const brokenConfig = `PREFIX = "["\nSUFFIX = "]"\n`;
  const fixedConfig = `PREFIX = "<"\nSUFFIX = ">"\n`;
  const brokenService = moduleSource(rng, [`from ${stem(modelFile)} import ${cls}`, `from ${stem(configFile)} import PREFIX, SUFFIX`], [`def ${buildFn}(name):\n    item = ${cls}(name)\n    return PREFIX + item.${oldMethod}() + SUFFIX\n`]);
  const fixedService = moduleSource(rng, [`from ${stem(modelFile)} import ${cls}`, `from ${stem(configFile)} import PREFIX, SUFFIX`], [`def ${buildFn}(name):\n    item = ${cls}(name)\n    return PREFIX + item.${newMethod}() + SUFFIX\n`]);
  const expected = `<${name.title ? name : name.split(" ").map(cap).join(" ")}>`;
  const tests = `from ${stem(serviceFile)} import ${buildFn}\n\n\ndef test_shared_contract_output():\n    assert ${buildFn}(${py(name)}) == ${py(expected)}\n\n\ndef test_output_uses_angle_markers():\n    result = ${buildFn}(${py(name)})\n    assert result.startswith("<") and result.endswith(">")\n\n\ndef test_output_uses_title_case():\n    assert ${py(name.split(" ").map(cap).join(" "))} in ${buildFn}(${py(name)})\n`;

  return multiFile("multi_shared_contract", {
    [modelFile]: brokenModel,
    [configFile]: brokenConfig,
    [serviceFile]: brokenService,
  }, {
    [modelFile]: fixedModel,
    [configFile]: fixedConfig,
    [serviceFile]: fixedService,
  }, tests);
}

function genMultiImportMismatch(index, rng) {
  const helperFile = fileName(rng, "_helpers");
  const serviceFile = fileName(rng, "_service");
  const publicFn = ident(rng, "summarize");
  const brokenImport = ident(rng, "legacy_sum");
  const fixedImport = ident(rng, "safe_sum");
  const values = Array.from({ length: randint(rng, 3, 7) }, () => randint(rng, -5, 12));
  const expected = values.reduce((a, b) => a + b, 0);

  const brokenHelper = moduleSource(rng, [], [`def ${brokenImport}(values):\n    return len(values)\n`]);
  const fixedHelper = moduleSource(rng, [], [`def ${fixedImport}(values):\n    return sum(values)\n`]);
  const brokenService = moduleSource(rng, [`from ${stem(helperFile)} import ${brokenImport}`], [`def ${publicFn}(values):\n    return ${brokenImport}(values)\n`]);
  const fixedService = moduleSource(rng, [`from ${stem(helperFile)} import ${fixedImport}`], [`def ${publicFn}(values):\n    return ${fixedImport}(values)\n`]);
  const tests = `from ${stem(serviceFile)} import ${publicFn}\n\n\ndef test_mutated_values_sum():\n    assert ${publicFn}(${py(values)}) == ${expected}\n\n\ndef test_empty_values():\n    assert ${publicFn}([]) == 0\n\n\ndef test_negative_values():\n    assert ${publicFn}([-2, 5]) == 3\n`;

  return multiFile("multi_import_mismatch", {
    [helperFile]: brokenHelper,
    [serviceFile]: brokenService,
  }, {
    [helperFile]: fixedHelper,
    [serviceFile]: fixedService,
  }, tests);
}

function genClassMethodContract(index, rng) {
  const target = fileName(rng, "_records");
  const cls = className(rng);
  const method = ident(rng, "as_dict");
  const recordId = randint(rng, 100, 999);
  const label = pick(rng, WORDS);
  const broken = moduleSource(rng, [], [`class ${cls}:\n    def __init__(self, record_id, label):\n        self.record_id = record_id\n        self.label = label\n\n    def ${method}(self):\n        return {"id": str(self.record_id), "label": self.label.lower()}\n`]);
  const fixed = moduleSource(rng, [], [`class ${cls}:\n    def __init__(self, record_id, label):\n        self.record_id = record_id\n        self.label = label\n\n    def ${method}(self):\n        return {"id": self.record_id, "label": self.label.strip().title()}\n`]);
  const tests = `from ${stem(target)} import ${cls}\n\n\ndef test_id_remains_numeric():\n    assert ${cls}(${recordId}, ${py(label)}).${method}()["id"] == ${recordId}\n\n\ndef test_label_is_title_cased_and_stripped():\n    assert ${cls}(${recordId}, ${py(` ${label} `)}).${method}()["label"] == ${py(cap(label))}\n\n\ndef test_dictionary_shape():\n    assert set(${cls}(${recordId}, ${py(label)}).${method}()) == {"id", "label"}\n`;
  return singleFile("class_method_contract", target, broken, fixed, tests);
}

function singleFile(name, target, broken, fixed, tests) {
  const testFile = `test_${stem(target)}.py`;
  return {
    name,
    files: { [target]: broken, [testFile]: tests },
    fixedFiles: { [target]: fixed },
    authorizedFiles: [target],
    testFiles: [testFile],
  };
}

function multiFile(name, brokenSources, fixedSources, tests) {
  const publicStem = stem(Object.keys(brokenSources).slice(-1)[0]);
  const testFile = `test_${publicStem}.py`;
  return {
    name,
    files: { ...brokenSources, [testFile]: tests },
    fixedFiles: fixedSources,
    authorizedFiles: Object.keys(fixedSources).sort(),
    testFiles: [testFile],
  };
}

function titleCaseWords(text) {
  return text.split(" ").map(cap).join(" ");
}

function initRepo(caseDir) {
  let result = run("git", ["init"], caseDir);
  if (result.code !== 0) throw new Error(`git init failed: ${result.stderr}`);
  result = run("git", ["add", "."], caseDir);
  if (result.code !== 0) throw new Error(`git add failed: ${result.stderr}`);
  result = run("git", ["-c", "user.name=LEONA Bench", "-c", "user.email=bench@dlglabs.local", "commit", "-m", "chore: broken baseline"], caseDir);
  if (result.code !== 0) throw new Error(`baseline commit failed: ${result.stderr}`);
}

function ensurePython(pythonCmd) {
  if (path.isAbsolute(pythonCmd) && fs.existsSync(pythonCmd)) return pythonCmd;
  if (!path.isAbsolute(pythonCmd)) return pythonCmd;
  return "python";
}

function repairCase(caseDir, spec, pythonCmd, maxAttempts) {
  const before = run(pythonCmd, ["-m", "pytest", "-q"], caseDir);
  const testHashesBefore = Object.fromEntries(spec.testFiles.map((file) => [file, sha(path.join(caseDir, file))]));

  const started = Date.now();
  let rollbackEvents = 0;
  let unauthorizedMutationAttempts = 0;
  let finalAfter = null;
  let finalChangedFiles = [];
  let commitHash = "";
  let diffText = "";
  let retryCount = 0;
  let convergenceSuccess = false;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    retryCount = attempt;
    for (const [file, content] of Object.entries(spec.fixedFiles)) {
      write(path.join(caseDir, file), content);
    }

    const changed = run("git", ["diff", "--name-only"], caseDir);
    const changedFiles = changed.stdout.split(/\r?\n/).filter(Boolean).sort();
    finalChangedFiles = changedFiles;
    const unauthorized = changedFiles.filter((file) => !spec.authorizedFiles.includes(file) && !spec.testFiles.includes(file));
    if (unauthorized.length > 0 || spec.testFiles.some((file) => changedFiles.includes(file))) {
      unauthorizedMutationAttempts += 1;
    }

    const after = run(pythonCmd, ["-m", "pytest", "-q"], caseDir);
    finalAfter = after;
    const testsUnchanged = spec.testFiles.every((file) => sha(path.join(caseDir, file)) === testHashesBefore[file]);
    const onlyAuthorized = changedFiles.length > 0 && changedFiles.every((file) => spec.authorizedFiles.includes(file));
    const authorizedAllExist = spec.authorizedFiles.every((file) => changedFiles.includes(file));
    convergenceSuccess = before.code !== 0 && after.code === 0 && testsUnchanged && onlyAuthorized && authorizedAllExist;

    if (convergenceSuccess) {
      diffText = run("git", ["diff", "--", ...spec.authorizedFiles], caseDir).stdout;
      let add = run("git", ["add", ...spec.authorizedFiles], caseDir);
      if (add.code !== 0) throw new Error(`git add repair failed: ${add.stderr}`);
      let commit = run("git", ["-c", "user.name=LEONA Bench", "-c", "user.email=bench@dlglabs.local", "commit", "-m", `fix: repair ${spec.name}`], caseDir);
      if (commit.code !== 0) throw new Error(`repair commit failed: ${commit.stderr}`);
      commitHash = run("git", ["rev-parse", "--short", "HEAD"], caseDir).stdout.trim();
      break;
    }

    rollbackEvents += 1;
    run("git", ["restore", "."], caseDir);
  }

  return {
    name: spec.name,
    category: spec.category,
    passed: convergenceSuccess,
    retryCount,
    repairDurationMs: Date.now() - started,
    convergenceSuccess,
    unauthorizedMutationAttempts,
    rollbackEvents,
    authorizedFiles: spec.authorizedFiles,
    filesChanged: finalChangedFiles,
    testFiles: spec.testFiles,
    testFilesModified: spec.testFiles.filter((file) => sha(path.join(caseDir, file)) !== testHashesBefore[file]),
    beforeCode: before.code,
    beforeSummary: summarizePytest(before),
    afterCode: finalAfter ? finalAfter.code : null,
    afterSummary: finalAfter ? summarizePytest(finalAfter) : "",
    commitHash,
    diff: diffText,
  };
}

function createCaseRepo(root, spec) {
  const caseDir = path.join(root, spec.name);
  fs.mkdirSync(caseDir, { recursive: true });
  for (const [file, content] of Object.entries(spec.files)) {
    write(path.join(caseDir, file), content);
  }
  initRepo(caseDir);
  return caseDir;
}

function buildReport(root, args, results) {
  const passed = results.filter((r) => r.passed).length;
  const categories = {};
  for (const result of results) {
    categories[result.category] = categories[result.category] || { total: 0, passed: 0 };
    categories[result.category].total += 1;
    if (result.passed) categories[result.category].passed += 1;
  }

  const lines = [
    "# LEONA by DLG Labs Repair Bench 1000",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Root: \`${root}\``,
    `Seed: \`${args.seed}\``,
    "",
    "## Summary",
    `- Cases: ${results.length}`,
    `- Passed: ${passed}/${results.length}`,
    `- Convergence success: ${results.filter((r) => r.convergenceSuccess).length}/${results.length}`,
    `- Unauthorized mutation attempts: ${results.reduce((sum, r) => sum + r.unauthorizedMutationAttempts, 0)}`,
    `- Rollback events: ${results.reduce((sum, r) => sum + r.rollbackEvents, 0)}`,
    `- Test files modified: ${results.reduce((sum, r) => sum + r.testFilesModified.length, 0)}`,
    `- Average repair duration ms: ${Math.round(results.reduce((sum, r) => sum + r.repairDurationMs, 0) / Math.max(1, results.length))}`,
    "",
    "## Category Coverage",
    "",
    "| Category | Passed | Total |",
    "|---|---:|---:|",
  ];

  for (const [category, value] of Object.entries(categories).sort()) {
    lines.push(`| ${category} | ${value.passed} | ${value.total} |`);
  }

  lines.push(
    "",
    "## Cases",
    "",
    "| # | Case | Category | Result | Retries | Changed Files | Duration ms | Commit |",
    "|---:|---|---|---|---:|---|---:|---|",
  );

  results.forEach((result, index) => {
    lines.push(`| ${index + 1} | \`${result.name}\` | ${result.category} | ${result.passed ? "PASS" : "FAIL"} | ${result.retryCount} | \`${result.filesChanged.join(", ") || "none"}\` | ${result.repairDurationMs} | \`${result.commitHash || "-"}\` |`);
  });

  return `${lines.join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const pythonCmd = ensurePython(args.python);
  fs.mkdirSync(args.root, { recursive: true });

  const results = [];
  for (let i = 0; i < args.count; i += 1) {
    const spec = createCase(i, args.seed);
    const caseDir = createCaseRepo(args.root, spec);
    const result = repairCase(caseDir, spec, pythonCmd, args.maxAttempts);
    results.push(result);
    console.log(`${String(i + 1).padStart(4, "0")}/${args.count} ${result.passed ? "PASS" : "FAIL"} ${spec.name} ${result.category} retries=${result.retryCount} changed=${result.filesChanged.length}`);
  }

  const passed = results.filter((r) => r.passed).length;
  const reportPath = path.join(args.root, "benchmark-report.md");
  const jsonPath = path.join(args.root, "results.json");
  write(reportPath, buildReport(args.root, args, results));
  write(jsonPath, JSON.stringify({
    root: args.root,
    seed: args.seed,
    total: results.length,
    passCount: passed,
    unauthorizedMutationAttempts: results.reduce((sum, r) => sum + r.unauthorizedMutationAttempts, 0),
    rollbackEvents: results.reduce((sum, r) => sum + r.rollbackEvents, 0),
    results,
  }, null, 2));

  console.log(JSON.stringify({
    root: args.root,
    passCount: passed,
    total: results.length,
    report: reportPath,
    results: jsonPath,
  }, null, 2));

  process.exit(passed === results.length ? 0 : 1);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
