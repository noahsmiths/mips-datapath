import $ from 'jQuery';

import { Wire } from './datapath/components/wire';
import { binaryToUnsigned32BitNumber, numberToBinary } from './datapath/utils/convert';

const w = new Wire(32);
w.setValue(binaryToUnsigned32BitNumber("10110011100010110011010110000000"));

console.log(numberToBinary(w.getBits(26, 31)));