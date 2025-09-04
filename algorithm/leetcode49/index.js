/**
 * 将字符串数组中的字母异位词（由相同字母不同顺序组成的词）分组。
 * @param {string[]} strs - 输入的字符串数组
 * @return {string[][]} - 返回一个二维数组，每个子数组包含一组异位词
 */
var groupAnagrams = function(strs) {
    // 创建一个 Map，用于存储：键为排序后的字符串，值为具有相同字母组成的原始字符串数组
    const map = new Map();

    // 遍历输入的每一个字符串
    for (let str of strs) {
        // 将当前字符串转换为字符数组（以便进行排序）
        let array = Array.from(str);

        // 对字符数组进行排序（这样所有异位词排序后会得到相同的字符串）
        array.sort();

        // 将排序后的字符数组转为字符串作为 Map 的键（例如："eat" -> "a,e,t"）
        // 注意：这里使用 toString() 会用逗号连接，等价于 join(',')
        let key = array.toString();

        // 从 Map 中获取当前键对应的值（即已收集的异位词数组）
        // 如果没有该键，则创建一个空数组
        let list = map.get(key) ? map.get(key) : new Array();

        // 将当前原始字符串加入到对应的异位词组中
        list.push(str);

        // 将更新后的数组重新存回 Map 中（以排序后的字符串为键）
        map.set(key, list);
    }

    // 将 Map 中所有的值（即分好组的异位词数组）转换为数组并返回
    // 结果是一个二维数组，每一项是一组异位词
    return Array.from(map.values());
};

const strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
groupAnagrams(strs)
