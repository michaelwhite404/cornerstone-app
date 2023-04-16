import LineGraph from "./Overview/LineGraph";

const data = [
  {
    _id: {
      $oid: "630cbac8101ddb0016c38027",
    },
    date: {
      $date: {
        $numberLong: "1661778632266",
      },
    },
    totalCount: 25,
    lateCount: 1,
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
    totalCount: 24,
    lateCount: 0,
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
    totalCount: 26,
    lateCount: 3,
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
    totalCount: 23,
    lateCount: 4,
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
    totalCount: 25,
    lateCount: 3,
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
    totalCount: 26,
    lateCount: 1,
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
    totalCount: 25,
    lateCount: 0,
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
    totalCount: 29,
    lateCount: 1,
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
    totalCount: 28,
    lateCount: 0,
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
    totalCount: 21,
    lateCount: 0,
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
    totalCount: 26,
    lateCount: 0,
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
    totalCount: 26,
    lateCount: 0,
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
    totalCount: 30,
    lateCount: 3,
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
    totalCount: 28,
    lateCount: 2,
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
    totalCount: 24,
    lateCount: 0,
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
    totalCount: 26,
    lateCount: 2,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 24,
    lateCount: 2,
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
    totalCount: 28,
    lateCount: 1,
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
    totalCount: 24,
    lateCount: 3,
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
    totalCount: 18,
    lateCount: 1,
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
    totalCount: 27,
    lateCount: 0,
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
    totalCount: 22,
    lateCount: 0,
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
    totalCount: 19,
    lateCount: 1,
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
    totalCount: 19,
    lateCount: 0,
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
    totalCount: 14,
    lateCount: 0,
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
    totalCount: 20,
    lateCount: 0,
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
    totalCount: 13,
    lateCount: 0,
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
    totalCount: 20,
    lateCount: 0,
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
    totalCount: 23,
    lateCount: 0,
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
    totalCount: 19,
    lateCount: 1,
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
    totalCount: 21,
    lateCount: 1,
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
    totalCount: 20,
    lateCount: 2,
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
    totalCount: 17,
    lateCount: 0,
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
    totalCount: 20,
    lateCount: 0,
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
    totalCount: 9,
    lateCount: 1,
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
    totalCount: 21,
    lateCount: 0,
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
    totalCount: 21,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 12,
    lateCount: 0,
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
    totalCount: 12,
    lateCount: 2,
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
    totalCount: 15,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 1,
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
    totalCount: 13,
    lateCount: 1,
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
    totalCount: 16,
    lateCount: 1,
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
    totalCount: 16,
    lateCount: 1,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 4,
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
    totalCount: 20,
    lateCount: 1,
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
    totalCount: 18,
    lateCount: 0,
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
    totalCount: 21,
    lateCount: 1,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 21,
    lateCount: 1,
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
    totalCount: 17,
    lateCount: 1,
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
    totalCount: 16,
    lateCount: 1,
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
    totalCount: 18,
    lateCount: 0,
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
    totalCount: 15,
    lateCount: 2,
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
    totalCount: 18,
    lateCount: 0,
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
    totalCount: 14,
    lateCount: 0,
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
    totalCount: 14,
    lateCount: 0,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 14,
    lateCount: 0,
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
    totalCount: 18,
    lateCount: 0,
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
    totalCount: 19,
    lateCount: 0,
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
    totalCount: 11,
    lateCount: 2,
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
    totalCount: 18,
    lateCount: 0,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 10,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 0,
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
    totalCount: 11,
    lateCount: 1,
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
    totalCount: 13,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 19,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 0,
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
    totalCount: 18,
    lateCount: 1,
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
    totalCount: 14,
    lateCount: 0,
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
    totalCount: 19,
    lateCount: 2,
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
    totalCount: 14,
    lateCount: 0,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 20,
    lateCount: 0,
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
    totalCount: 24,
    lateCount: 1,
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
    totalCount: 22,
    lateCount: 0,
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
    totalCount: 16,
    lateCount: 1,
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
    totalCount: 19,
    lateCount: 1,
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
    totalCount: 12,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 1,
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
    totalCount: 20,
    lateCount: 0,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 18,
    lateCount: 1,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 13,
    lateCount: 0,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 1,
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
    totalCount: 16,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 0,
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
    totalCount: 15,
    lateCount: 0,
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
    totalCount: 12,
    lateCount: 1,
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
    totalCount: 17,
    lateCount: 1,
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
    totalCount: 19,
    lateCount: 0,
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
    totalCount: 20,
    lateCount: 0,
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
    totalCount: 19,
    lateCount: 0,
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
    totalCount: 17,
    lateCount: 1,
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
    totalCount: 19,
    lateCount: 0,
  },
  {
    _id: {
      $oid: "640795cccb84b500144c524a",
    },
    date: {
      $date: {
        $numberLong: "1678218700875",
      },
    },
    totalCount: 16,
    lateCount: 0,
  },
  {
    _id: {
      $oid: "6408e8801a988d001488cf35",
    },
    date: {
      $date: {
        $numberLong: "1678305408273",
      },
    },
    totalCount: 14,
    lateCount: 0,
  },
  {
    _id: {
      $oid: "640a3997b8cfea001425d337",
    },
    date: {
      $date: {
        $numberLong: "1678391703649",
      },
    },
    totalCount: 21,
    lateCount: 0,
  },
  {
    _id: {
      $oid: "640f71b452a61000145a4ced",
    },
    date: {
      $date: {
        $numberLong: "1678733748704",
      },
    },
    totalCount: 18,
    lateCount: 0,
  },
  {
    _id: {
      $oid: "6410cb131d607000140ce0ec",
    },
    date: {
      $date: {
        $numberLong: "1678822163372",
      },
    },
    totalCount: 19,
    lateCount: 0,
  },
];
const sessions = data.map((session) => ({
  _id: session._id.$oid,
  date: new Date(+session.date.$date.$numberLong),
  totalCount: session.totalCount,
  lateCount: session.lateCount,
}));

export default function Overview() {
  return <LineGraph sessions={sessions} />;
}
