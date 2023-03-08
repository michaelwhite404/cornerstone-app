import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { format } from "date-fns";
Chart.register(CategoryScale);

const UserData = [
  {
    _id: {
      $oid: "630cbac8101ddb0016c38027",
    },
    date: {
      $date: {
        $numberLong: "1661778632266",
      },
    },
    total: 25,
  },
  {
    _id: {
      $oid: "630e5e8a0907bc00169f9b47",
    },
    date: {
      $date: {
        $numberLong: "1661886090432",
      },
    },
    total: 24,
  },
  {
    _id: {
      $oid: "630fb1a8137eb20016c9fdfc",
    },
    date: {
      $date: {
        $numberLong: "1661972904906",
      },
    },
    total: 26,
  },
  {
    _id: {
      $oid: "6311053d422e630016672dfe",
    },
    date: {
      $date: {
        $numberLong: "1662059837836",
      },
    },
    total: 23,
  },
  {
    _id: {
      $oid: "631252859293d10016ed6361",
    },
    date: {
      $date: {
        $numberLong: "1662145157080",
      },
    },
    total: 25,
  },
  {
    _id: {
      $oid: "63179cdc3eb2120016f19ff3",
    },
    date: {
      $date: {
        $numberLong: "1662491868443",
      },
    },
    total: 26,
  },
  {
    _id: {
      $oid: "6318e91847462200164a30b5",
    },
    date: {
      $date: {
        $numberLong: "1662576920784",
      },
    },
    total: 25,
  },
  {
    _id: {
      $oid: "631a3ff67f8734001610e4ab",
    },
    date: {
      $date: {
        $numberLong: "1662664694388",
      },
    },
    total: 29,
  },
  {
    _id: {
      $oid: "631b90293413d70016269bdb",
    },
    date: {
      $date: {
        $numberLong: "1662750761388",
      },
    },
    total: 28,
  },
  {
    _id: {
      $oid: "631f81e2459a960016cd487a",
    },
    date: {
      $date: {
        $numberLong: "1663009250630",
      },
    },
    total: 21,
  },
  {
    _id: {
      $oid: "6320d2de90acce00160da7fd",
    },
    date: {
      $date: {
        $numberLong: "1663095518732",
      },
    },
    total: 26,
  },
  {
    _id: {
      $oid: "632222c0423c8f0016f00cdf",
    },
    date: {
      $date: {
        $numberLong: "1663181504546",
      },
    },
    total: 26,
  },
  {
    _id: {
      $oid: "6323795c230f5800164b22e5",
    },
    date: {
      $date: {
        $numberLong: "1663269212037",
      },
    },
    total: 30,
  },
  {
    _id: {
      $oid: "6324ca24ed3d5d001653143b",
    },
    date: {
      $date: {
        $numberLong: "1663355428325",
      },
    },
    total: 28,
  },
  {
    _id: {
      $oid: "6328be841777f30016c9c735",
    },
    date: {
      $date: {
        $numberLong: "1663614596633",
      },
    },
    total: 24,
  },
  {
    _id: {
      $oid: "632a0d8bf3cdc30016fdd856",
    },
    date: {
      $date: {
        $numberLong: "1663700363023",
      },
    },
    total: 26,
  },
  {
    _id: {
      $oid: "632b600d68bb57001652b0f5",
    },
    date: {
      $date: {
        $numberLong: "1663787021505",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "632cb4c15e054b0016915e18",
    },
    date: {
      $date: {
        $numberLong: "1663874241926",
      },
    },
    total: 24,
  },
  {
    _id: {
      $oid: "6331f8bd0b769400161334e0",
    },
    date: {
      $date: {
        $numberLong: "1664219325392",
      },
    },
    total: 28,
  },
  {
    _id: {
      $oid: "63334866aa48810016de0f1e",
    },
    date: {
      $date: {
        $numberLong: "1664305254330",
      },
    },
    total: 24,
  },
  {
    _id: {
      $oid: "6334a1235b7a030016d2f9d7",
    },
    date: {
      $date: {
        $numberLong: "1664393507861",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "6335ee2d8deca900168b1010",
    },
    date: {
      $date: {
        $numberLong: "1664478765350",
      },
    },
    total: 27,
  },
  {
    _id: {
      $oid: "6337424d98cb180016ac0945",
    },
    date: {
      $date: {
        $numberLong: "1664565837551",
      },
    },
    total: 22,
  },
  {
    _id: {
      $oid: "633b33e4785d020016f9d605",
    },
    date: {
      $date: {
        $numberLong: "1664824292871",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "633c8250c6a16f00165be0db",
    },
    date: {
      $date: {
        $numberLong: "1664909904964",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "633dd754102f3300165db583",
    },
    date: {
      $date: {
        $numberLong: "1664997204841",
      },
    },
    total: 14,
  },
  {
    _id: {
      $oid: "633f282cc3349000169e04fd",
    },
    date: {
      $date: {
        $numberLong: "1665083436049",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "63407a18cc167200168ab935",
    },
    date: {
      $date: {
        $numberLong: "1665169944697",
      },
    },
    total: 13,
  },
  {
    _id: {
      $oid: "6345c1737d61f2001640249d",
    },
    date: {
      $date: {
        $numberLong: "1665515891823",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "63471214b730ea001692f7b4",
    },
    date: {
      $date: {
        $numberLong: "1665602068381",
      },
    },
    total: 23,
  },
  {
    _id: {
      $oid: "6348619495c25b0016deed05",
    },
    date: {
      $date: {
        $numberLong: "1665687956069",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "6349b58227b13700163ec2fd",
    },
    date: {
      $date: {
        $numberLong: "1665774978173",
      },
    },
    total: 21,
  },
  {
    _id: {
      $oid: "634ef76d13eeed00168c1a3c",
    },
    date: {
      $date: {
        $numberLong: "1666119533254",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "63504c4e3553a30016bb8a54",
    },
    date: {
      $date: {
        $numberLong: "1666206798125",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63519eca3553a30016bb8b61",
    },
    date: {
      $date: {
        $numberLong: "1666293450186",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "6352f0c32ab20b00163ccebb",
    },
    date: {
      $date: {
        $numberLong: "1666379971233",
      },
    },
    total: 9,
  },
  {
    _id: {
      $oid: "6356e3789782a20016152ea0",
    },
    date: {
      $date: {
        $numberLong: "1666638712430",
      },
    },
    total: 21,
  },
  {
    _id: {
      $oid: "6358327f328f3e00165a1a6f",
    },
    date: {
      $date: {
        $numberLong: "1666724479035",
      },
    },
    total: 21,
  },
  {
    _id: {
      $oid: "63598771edf7150016f0100b",
    },
    date: {
      $date: {
        $numberLong: "1666811761939",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "635ad5f71c39070016367510",
    },
    date: {
      $date: {
        $numberLong: "1666897399829",
      },
    },
    total: 12,
  },
  {
    _id: {
      $oid: "635c29ca0e1f1f0016abd60c",
    },
    date: {
      $date: {
        $numberLong: "1666984394825",
      },
    },
    total: 12,
  },
  {
    _id: {
      $oid: "63616e41fe072200161e9151",
    },
    date: {
      $date: {
        $numberLong: "1667329601705",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "6362c18c3cab2c0016ca27fa",
    },
    date: {
      $date: {
        $numberLong: "1667416460109",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "636412627938670016de1256",
    },
    date: {
      $date: {
        $numberLong: "1667502690254",
      },
    },
    total: 13,
  },
  {
    _id: {
      $oid: "6365686947b1ad0016ac4774",
    },
    date: {
      $date: {
        $numberLong: "1667590249790",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63696204e3cdf60016983a8f",
    },
    date: {
      $date: {
        $numberLong: "1667850756809",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "636ab54adc2d8e001693dc50",
    },
    date: {
      $date: {
        $numberLong: "1667937610433",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "636c04c25013b30016ad9d56",
    },
    date: {
      $date: {
        $numberLong: "1668023490352",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "636d583e9cb0be0016ce0e31",
    },
    date: {
      $date: {
        $numberLong: "1668110398914",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "63729efc6b0dfb001678b4fa",
    },
    date: {
      $date: {
        $numberLong: "1668456188384",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "6373ee39e7ae6600167f4d07",
    },
    date: {
      $date: {
        $numberLong: "1668542009935",
      },
    },
    total: 21,
  },
  {
    _id: {
      $oid: "63753f22e7122c0016db17c9",
    },
    date: {
      $date: {
        $numberLong: "1668628258931",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "637690942dfa1c001663f265",
    },
    date: {
      $date: {
        $numberLong: "1668714644818",
      },
    },
    total: 21,
  },
  {
    _id: {
      $oid: "6377e697958beb0016da8dcf",
    },
    date: {
      $date: {
        $numberLong: "1668802199932",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63851223159df80016bfa5c2",
    },
    date: {
      $date: {
        $numberLong: "1669665315011",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "6386648ea8b2050016baa604",
    },
    date: {
      $date: {
        $numberLong: "1669751950167",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "6387b42c2e4754001642d05a",
    },
    date: {
      $date: {
        $numberLong: "1669837868473",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "638906b56bc7a80016fad7f0",
    },
    date: {
      $date: {
        $numberLong: "1669924533548",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "638a61633f98600016d8ecbc",
    },
    date: {
      $date: {
        $numberLong: "1670013283750",
      },
    },
    total: 14,
  },
  {
    _id: {
      $oid: "638e4c9fd5cac20016c7508f",
    },
    date: {
      $date: {
        $numberLong: "1670270111676",
      },
    },
    total: 14,
  },
  {
    _id: {
      $oid: "638fa53525d1210016eaff02",
    },
    date: {
      $date: {
        $numberLong: "1670358325159",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "6390f84e1306df00164a1301",
    },
    date: {
      $date: {
        $numberLong: "1670445134356",
      },
    },
    total: 14,
  },
  {
    _id: {
      $oid: "639245781306df00164a1c41",
    },
    date: {
      $date: {
        $numberLong: "1670530424587",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "639393fc1c9fe80016964a67",
    },
    date: {
      $date: {
        $numberLong: "1670616060771",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "63978aa2996c200016b3cdd4",
    },
    date: {
      $date: {
        $numberLong: "1670875810492",
      },
    },
    total: 11,
  },
  {
    _id: {
      $oid: "6398d8d7c83b87001694b724",
    },
    date: {
      $date: {
        $numberLong: "1670961367783",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "639a2d396cab200016483d2d",
    },
    date: {
      $date: {
        $numberLong: "1671048505966",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "639b7d3d8072a40016610eea",
    },
    date: {
      $date: {
        $numberLong: "1671134525695",
      },
    },
    total: 10,
  },
  {
    _id: {
      $oid: "639ccce9e0a53f0016e6e020",
    },
    date: {
      $date: {
        $numberLong: "1671220457095",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63b489fae0156d001683938a",
    },
    date: {
      $date: {
        $numberLong: "1672776186370",
      },
    },
    total: 11,
  },
  {
    _id: {
      $oid: "63b5db4ed4df3a0016e0da91",
    },
    date: {
      $date: {
        $numberLong: "1672862542710",
      },
    },
    total: 13,
  },
  {
    _id: {
      $oid: "63b72ce578996400166acc43",
    },
    date: {
      $date: {
        $numberLong: "1672948965481",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63b87c797856e5001674ce6a",
    },
    date: {
      $date: {
        $numberLong: "1673034873242",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "63bc7133f2974a0016130772",
    },
    date: {
      $date: {
        $numberLong: "1673294131893",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63bdc445cc39d1001600ea60",
    },
    date: {
      $date: {
        $numberLong: "1673380933675",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63bf173fb55be20016d0f697",
    },
    date: {
      $date: {
        $numberLong: "1673467711144",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "63c065957476df00161b92d1",
    },
    date: {
      $date: {
        $numberLong: "1673553301579",
      },
    },
    total: 14,
  },
  {
    _id: {
      $oid: "63c1b9602c7d13001618d281",
    },
    date: {
      $date: {
        $numberLong: "1673640288839",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "63c7005d4c9cc2001650e618",
    },
    date: {
      $date: {
        $numberLong: "1673986141208",
      },
    },
    total: 14,
  },
  {
    _id: {
      $oid: "63c8512b64c066001623b2d1",
    },
    date: {
      $date: {
        $numberLong: "1674072363535",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63c9a24c093d1c001623b312",
    },
    date: {
      $date: {
        $numberLong: "1674158668555",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "63caf2cb1b0fdb0016e23591",
    },
    date: {
      $date: {
        $numberLong: "1674244811375",
      },
    },
    total: 24,
  },
  {
    _id: {
      $oid: "63cee65e6d5f030016c3690e",
    },
    date: {
      $date: {
        $numberLong: "1674503774603",
      },
    },
    total: 22,
  },
  {
    _id: {
      $oid: "63d0369392c8fb001614627d",
    },
    date: {
      $date: {
        $numberLong: "1674589843793",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63d18cdbc4735e0016306c8f",
    },
    date: {
      $date: {
        $numberLong: "1674677467150",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "63d2dc3199fcf10016fdb25d",
    },
    date: {
      $date: {
        $numberLong: "1674763313179",
      },
    },
    total: 12,
  },
  {
    _id: {
      $oid: "63d81fd8087e960016a27acf",
    },
    date: {
      $date: {
        $numberLong: "1675108312936",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63d971408456cc0016e991bd",
    },
    date: {
      $date: {
        $numberLong: "1675194688512",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63dac37cd1cb90001608bb46",
    },
    date: {
      $date: {
        $numberLong: "1675281276626",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63dc1612267b440016dcaeb0",
    },
    date: {
      $date: {
        $numberLong: "1675367954094",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63dd696a61cd240016161817",
    },
    date: {
      $date: {
        $numberLong: "1675454826949",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "63e15b12f69e270014faaeaf",
    },
    date: {
      $date: {
        $numberLong: "1675713298654",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63e2ac96e1ffe10014db4e54",
    },
    date: {
      $date: {
        $numberLong: "1675799702276",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63e40bfde716a90014747fcf",
    },
    date: {
      $date: {
        $numberLong: "1675889661278",
      },
    },
    total: 18,
  },
  {
    _id: {
      $oid: "63e5522f3c498900147b0f6b",
    },
    date: {
      $date: {
        $numberLong: "1675973167960",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63ea957114269a001465cf5c",
    },
    date: {
      $date: {
        $numberLong: "1676318065543",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63ebf173aa61940014a41521",
    },
    date: {
      $date: {
        $numberLong: "1676407155278",
      },
    },
    total: 13,
  },
  {
    _id: {
      $oid: "63ed3c916ee9370014f31f18",
    },
    date: {
      $date: {
        $numberLong: "1676491921412",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63ee8e16acb0be00146efe35",
    },
    date: {
      $date: {
        $numberLong: "1676578326289",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63efdc68675bf30014e23175",
    },
    date: {
      $date: {
        $numberLong: "1676663912549",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63f520f99952e70014b0aecd",
    },
    date: {
      $date: {
        $numberLong: "1677009145305",
      },
    },
    total: 16,
  },
  {
    _id: {
      $oid: "63f67439869b5e00145ea533",
    },
    date: {
      $date: {
        $numberLong: "1677095993088",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63f7c8282518f2001450e28f",
    },
    date: {
      $date: {
        $numberLong: "1677183016719",
      },
    },
    total: 15,
  },
  {
    _id: {
      $oid: "63f91d66af1c9d0014ad0da6",
    },
    date: {
      $date: {
        $numberLong: "1677270374756",
      },
    },
    total: 12,
  },
  {
    _id: {
      $oid: "63fd0e220f9998001412e504",
    },
    date: {
      $date: {
        $numberLong: "1677528610615",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "63fe5dd3dd98800014011be5",
    },
    date: {
      $date: {
        $numberLong: "1677614547601",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "63ffb152ab84130014d9d3fa",
    },
    date: {
      $date: {
        $numberLong: "1677701458939",
      },
    },
    total: 20,
  },
  {
    _id: {
      $oid: "6400ff7b7b79f300140a30cb",
    },
    date: {
      $date: {
        $numberLong: "1677787003345",
      },
    },
    total: 19,
  },
  {
    _id: {
      $oid: "6402502ff54e620014960ade",
    },
    date: {
      $date: {
        $numberLong: "1677873199153",
      },
    },
    total: 17,
  },
  {
    _id: {
      $oid: "640647957a80100014c70feb",
    },
    date: {
      $date: {
        $numberLong: "1678133141071",
      },
    },
    total: 19,
  },
];

const getLabels = () => {
  let currentMonth = new Date(parseInt(UserData[0].date.$date.$numberLong, 10)).getMonth();
  const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

  return UserData.map((session, index) => {
    const date = new Date(parseInt(session.date.$date.$numberLong, 10));
    const month = date.getMonth();
    if (!index) return formatDate(date);
    if (month === currentMonth) return "";
    currentMonth = month;
    return formatDate(date);
  });
};

const userData = {
  labels: getLabels(),
  datasets: [
    {
      label: "Users Gained",
      data: UserData.map((data) => data.total),
      backgroundColor: ["black", "black", "black", "black", "black"],
      borderColor: "rgb(5,102,195)",
      borderWidth: 3,
      pointRadius: 0,
      pointHoverBorderWidth: 0,
      pointHoverBackgroundColor: "black",
      tension: 0.6,
    },
  ],
};

// const options =

export default function Overview() {
  const ref = useRef<HTMLDivElement | null>(null);
  // @ts-ignore
  const startText = `Last session: ${UserData.at(-1)?.total} students`;
  return (
    <div className="py-3 px-6 rounded-lg">
      <div ref={ref} className="mb-3 h-5">
        {startText}
      </div>
      <div className="h-32">
        <Line
          height={200}
          options={{
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            hover: { mode: "index", intersect: false },
            interaction: { intersect: false, mode: "index" },
            scales: {
              x: { grid: { display: false }, ticks: { autoSkip: false } },
              y: { grid: { display: false }, display: false },
            },
            maintainAspectRatio: false,
          }}
          data={userData}
          plugins={[
            {
              id: "hoverId", //typescript crashes without id
              afterDraw: function (chart: any, easing: any) {
                if (chart.tooltip?._active?.length) {
                  if (ref.current) {
                    const data = UserData[chart.tooltip._active[0].index];
                    ref.current.innerHTML = `<b>Students: ${data.total.toString()}</b> Date: ${format(
                      new Date(+data.date.$date.$numberLong),
                      "P"
                    )}`;
                  }
                  let x = chart.tooltip._active[0].element.x;
                  let yAxis = chart.scales.y;
                  let ctx = chart.ctx;
                  ctx.save();
                  ctx.beginPath();
                  ctx.moveTo(x, yAxis.top);
                  ctx.lineTo(x, yAxis.bottom);
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = "black";
                  ctx.stroke();
                  ctx.restore();
                } else {
                  if (ref.current) {
                    ref.current.innerHTML = startText;
                  }
                }
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
