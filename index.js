"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pupp = __importStar(require("puppeteer"));
const getInfoByYear = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield pupp.launch({ headless: 'new' });
    const page = yield browser.newPage();
    yield page.goto('https://mathscinet.ams.org/');
    // click radio button
    yield page.waitForSelector('input#pubyear');
    yield page.click('input#pubyear');
    // type year
    yield page.type('input#yearValue', String(year));
    // await page.pdf({path: 'beforeclick.pdf'});
    console.log("before");
    // submit form
    try {
        console.log('try');
        yield page.waitForSelector("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
        yield page.click("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
        // await page.waitForNavigation();
    }
    catch (err) {
        console.log('err');
        yield page.waitForSelector("#titleSeparator > div.extendHeadlines > a");
        yield page.click("#titleSeparator > div.extendHeadlines > a");
        // await page.waitForNavigation();
    }
    console.log("after");
    // await page.pdf({path: 'afterclick.pdf'});
    yield page.waitForSelector('.headlineText');
    const els = yield page.$$eval('.headlineText', eL => eL.map(el => el.textContent));
    console.log("doop");
    let info = yield els.map((el) => {
        return (el
            .split("\n")
            .map((e) => e.trim())
            .filter((e) => e != ""));
    });
    let info_bop = info.map((el) => {
        return ({
            'id': el[0],
            'type': el[1],
            'authtitle': el[2],
            'pubyear': el[11],
            'exdat': el[3],
        });
    });
    // info_bop.forEach((el) => console.log(el));
    yield page.pdf({ path: 'goog.pdf' });
    yield browser.close();
    return (info_bop);
});
const getInfoByYearEasy = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield pupp.launch({ headless: 'new' });
    const page = yield browser.newPage();
    yield page.goto('https://mathscinet.ams.org/');
    // click radio button
    yield page.waitForSelector('input#pubyear');
    yield page.click('input#pubyear');
    // type year
    yield page.type('input#yearValue', String(year));
    // await page.pdf({path: 'beforeclick.pdf'});
    console.log("before");
    // submit form
    try {
        console.log('try');
        yield page.waitForSelector("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
        yield page.click("#publicationsBlock > div.folderWrap1 > div > div > div.folderContent > form > div.submitBox > input:nth-child(1)");
        // await page.waitForNavigation();
    }
    catch (err) {
        console.log('err');
        yield page.waitForSelector("#titleSeparator > div.extendHeadlines > a");
        yield page.click("#titleSeparator > div.extendHeadlines > a");
        // await page.waitForNavigation();
    }
    console.log("after");
    const isBadYear = (y) => {
        return ((year >= 1930 && year < 1935) || (1925 <= year && year <= 1927) || (1967 <= year && year <= 1969) || (1972 <= year));
    };
    yield page.waitForSelector(`#content > form > div.row.has-side-left > div.aggs.row-side > div > div.searchagg > dl:nth-child(${isBadYear(year) ? 4 : 3}) > dd > ul`);
    const els = yield page.$$eval(`#content > form > div.row.has-side-left > div.aggs.row-side > div > div.searchagg > dl:nth-child(${isBadYear(year) ? 4 : 3}) > dd > ul > li`, el => el.map(e => e.textContent)); //.map(e => e.textContent));
    const info = els.map(el => el.trim()).map(el => el.replaceAll("(", "")).map(el => el.replaceAll(")", "")).map(el => el.split("\n\n\n"));
    yield browser.close();
    return info;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(await getInfoByYearEasy(1900));
    let data = {};
    for (let i = 1900; i != 2022; i++) {
        console.log(i);
        data[i] = yield getInfoByYearEasy(i);
        console.log("success");
    }
    console.log(data);
}))();
