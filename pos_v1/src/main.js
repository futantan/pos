function printInventory(inputs) {
    var arrayOfAllItems = loadAllItems();
    var arrayOfAllItemsCount = getArrayOfAllItemsCount(arrayOfAllItems, inputs);
    var freeCountOfAllItems = getFreeCountOfAllItems(arrayOfAllItems, arrayOfAllItemsCount);

    var stringOfInventory = "";
    stringOfInventory += getShoppingListInventory(arrayOfAllItems, arrayOfAllItemsCount, freeCountOfAllItems);
    stringOfInventory += getFreeItemsInventory(arrayOfAllItems, freeCountOfAllItems);
    stringOfInventory += getTotalCountInventory(arrayOfAllItems, arrayOfAllItemsCount, freeCountOfAllItems);
    console.log(stringOfInventory);
}

function getShoppingListInventory(arrayOfAllItems, arrayOfAllItemsCount, freeCountOfAllItems) {
    var shoppingListInventory = "***<没钱赚商店>购物清单***\n";
    for (var i = 0; i < arrayOfAllItemsCount.length; i++) {
        if (arrayOfAllItemsCount[i] != 0) {
            shoppingListInventory += "名称：" + arrayOfAllItems[i].name + "，数量：" + arrayOfAllItemsCount[i] + arrayOfAllItems[i].unit + "，单价：" + arrayOfAllItems[i].price.toFixed(2) + "(元)，小计：" + ((arrayOfAllItemsCount[i] - freeCountOfAllItems[i]) * arrayOfAllItems[i].price).toFixed(2) + "(元)\n";
        }
    }
    shoppingListInventory += "----------------------\n";
    return shoppingListInventory;
}

function getFreeItemsInventory(arrayOfAllItems, freeCountOfAllItems) {
    var freeItemsInventory = "挥泪赠送商品：\n";
    for (var i = 0; i < freeCountOfAllItems.length; i++) {
        if (freeCountOfAllItems[i] != 0) {
            freeItemsInventory += "名称：" + arrayOfAllItems[i].name + "，数量：" + freeCountOfAllItems[i] + arrayOfAllItems[i].unit + "\n";
        }
    }
    freeItemsInventory += "----------------------\n";
    return freeItemsInventory;
}

function getTotalCountInventory(arrayOfAllItems, arrayOfAllItemsCount, freeCountOfAllItems) {
    var totalCountInventory = "总计：";
    var totalCount = 0;
    var totalSaved = 0;
    for (var i = 0; i < arrayOfAllItemsCount.length; i++) {
        if (arrayOfAllItemsCount[i] != 0) {
            totalCount += arrayOfAllItems[i].price * (arrayOfAllItemsCount[i] - freeCountOfAllItems[i]);
            totalSaved += arrayOfAllItems[i].price * freeCountOfAllItems[i];
        }
    }
    totalCountInventory += totalCount.toFixed(2) + "(元)\n节省：" + totalSaved.toFixed(2) + "(元)\n**********************";
    return totalCountInventory;
}


function getArrayOfAllItemsCount(arrayOfAllItems, inputs) {
    var arrayOfAllItemsCount = getArrayInitializedWithZero(arrayOfAllItems.length);
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].indexOf("-") != -1) {
            var splitResult = inputs[i].split('-');
            var indexOfCartItemGotInAllItems = findIndexOfTargetBarcodeInArrayOfAllItems(splitResult[0], arrayOfAllItems);
            arrayOfAllItemsCount[indexOfCartItemGotInAllItems] += parseInt(splitResult[1]);
        }
        if (inputs[i].indexOf("-") == -1) {
            var indexOfCartItemInAllItems = findIndexOfTargetBarcodeInArrayOfAllItems(inputs[i], arrayOfAllItems);
            arrayOfAllItemsCount[indexOfCartItemInAllItems]++;
        }
    }
    return arrayOfAllItemsCount;
}

function getFreeCountOfAllItems(arrayOfAllItems, arrayOfAllItemsCount) {
    var freeCountOfAllItems;
    var promotions = loadPromotions();
    for (var i = 0; i < promotions.length; i++) {
        switch (promotions[i].type) {
            case "BUY_TWO_GET_ONE_FREE":
                freeCountOfAllItems = getArrayOfPromoteBuyTwoGetOneFreeCount(promotions[i].barcodes, arrayOfAllItems, arrayOfAllItemsCount);
                break;
            case "OTHER_PROMOTION":
                break;
            default:
                break;
        }
    }
    return freeCountOfAllItems;
}

function getArrayOfPromoteBuyTwoGetOneFreeCount(arrayOfPromoteBarcode, arrayOfAllItems, arrayOfAllItemsCount) {
    var freeCountOfAllItems = getArrayInitializedWithZero(arrayOfAllItems.length);
    for (var i = 0; i < arrayOfPromoteBarcode.length; i++) {
        var indexInAllItems = findIndexOfTargetBarcodeInArrayOfAllItems(arrayOfPromoteBarcode[i], arrayOfAllItems);
        freeCountOfAllItems[indexInAllItems] = parseInt(arrayOfAllItemsCount[indexInAllItems] / 3);
    }
    return freeCountOfAllItems;
}


function findIndexOfTargetBarcodeInArrayOfAllItems(targetBarcode, arrayOfAllItems) {
    var index;
    for (var i = 0; i < arrayOfAllItems.length; i++) {
        if (targetBarcode == arrayOfAllItems[i].barcode) {
            index = i;
            break;
        }
    }
    return index;
}

function getArrayInitializedWithZero(length) {
    var array = new Array(length);
    for (var i = 0; i < length; i++) {
        array[i] = 0;
    }
    return array;
}