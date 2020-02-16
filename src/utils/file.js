/**
 * 文件转成base64
 * @param {Object<File>} file
 * 返回值，‘不支持FileReader’/base64字符串
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (FileReader) {
      const temp = new FileReader()
      temp.readAsDataURL(file)
      temp.onload = (e) => {
        resolve(e.target.result)
      }
    } else {
      reject('不支持FileReader')
    }
  })
}

/**
 * 文件转成text
 * @param {Object<File>} file
 * 返回值，‘不支持FileReader’/text字符串
 */
export const fileToText = (file) => {
  return new Promise((resolve, reject) => {
    if (FileReader) {
      const temp = new FileReader()
      temp.readAsText(file, 'utf-8')
      temp.onload = (e) => {
        resolve(e.target.result)
      }
    } else {
      reject('不支持FileReader')
    }
  })
}
