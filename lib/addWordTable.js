const fs = require('fs')
const x  = require('./getRoman')

let moment = require('moment')

const WORD_LIST     = './wordList.json'
const NEW_WORD_LIST = './newWordList.json'
const WORD_LIST_BAK = './bak/wordList_' + moment().format('YYYYMMDDhhmmss') + '.json'

/**
 * メイン関数
 */
const main = () => {
  let newWordList = JSON.parse(fs.readFileSync(NEW_WORD_LIST))
  let wordList    = JSON.parse(fs.readFileSync(WORD_LIST))

  // 追加ワードファイルのチェック
  if (!isUnitable(wordList, newWordList)) {
    // エラー発生時
    console.log('追加ワードテーブルでエラーが発生したため終了します。')
    return
  }

  // バックアップファイルの出力
  fs.writeFile(WORD_LIST_BAK, JSON.stringify(wordList, null, 2), err => console.log(err))

  // 追加ワードの成形
  if (!convYomiToRomaji(newWordList)) return
  if (!insertWordList(wordList, newWordList)) return

  // ファイル書き出し
  fs.writeFile(WORD_LIST, JSON.stringify(wordList, null, 2), err => console.log(err))
}

/**
 * 追加テーブルのデータが追加可能かチェックします。
 * @param {Object} wordList ワードリスト
 * @param {Object} newWordList 追加ワードリスト
 * @returns {boolean} 追加可能な場合、true
 */
const isUnitable = (wordList, newWordList) => {
  let result = true
  const records = newWordList.dictionary

  // newWordListが存在するかチェック
  if (records == null) {
    console.log('dictionaryが存在しません。')
    return false
  }

  // 各レコードをチェック
  records.forEach((record, idx) => {
    if (typeof record.display !== 'string' || record.display === '') {
      console.log('表示する文字列が指定されていません: ' + idx + '番目のレコード')
      result = false
    }
    if (typeof record.yomi !== 'string' || record.yomi === '') {
      console.log('読みが指定されていません: ' + idx + '番目のレコード')
      result = false
    }
    wordList.dictionary.forEach(data => {
      if (data.display === record.display) {
        console.log('すでに登録されています:' + idx + '番目のレコード')
        result = false
      }
    })
  })
  return result
}

/**
 * 追加ワードのyomiからローマ字読みを追加します。
 * @param {Object} newWordList 追加ワード
 * @returns {boolean} すべての読みがなの変換が完了した場合、true
 */
const convYomiToRomaji = (newWordList) => {
  newWordList.dictionary.forEach(data => {
    let romaji
    try {
      romaji = x.getRoman(data.yomi)
    } catch (err) {
      console.log(err)
      return false
    }
    data.sentenceJp = data.display
    data.sentenceRm = romaji
  })
  return true
}

/**
 * ワードリストに追加します
 * @param {Object} wordList ワードリスト
 * @param {Object} newWordList 追加ワードリスト
 */
const insertWordList = (wordList, newWordList) => {
  wordList.dictionary.push(...(newWordList.dictionary))
  return true
}

main()
