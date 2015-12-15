var word = {"ih": "ɪ","ax": "ə","oh": "ɒ","uh": "ʊ","ah": "ʌ","eh": "e","ae": "æ","iy": "i:","er": "ɜ:","axr": "ɚ","ao": "ɔ:","uw": "u:","aa": "ɑ:","ey": "eɪ","ay": "aɪ","oy": "ɔɪ ","aw": "aʊ","ow": "әʊ","ia": "ɪə ","ea": "ɛә","ua": "ʊə","p": "p","b": "b","t": "t","d": "d","k": "k","g": "g","l": "l","r": "r","m": "m","n": "n", "ng": "ŋ","hh": "h","s": "s","z": "z","th": "θ","dh": "ð","f": "f","v": "v","w": "w","y": "j","sh": "ʃ","zh": "ʒ","ch": "tʃ","jh": "dʒ"};

function toword(txt){
    if(word[txt]){
        return word[txt];
    }else{
        return txt;
    };
};