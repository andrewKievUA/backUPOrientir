function determineDefectCounts(details) {
    const defectCounts = {
        rassloenie: 0,
        skol: 0,
        skol_treshina: 0,
        treshina: 0,
        ugolok_treshina: 0,
        vidbutosti: 0,
        zaterto_valami: 0,
        vidbutosti_200:0,

    };

    details.forEach(detail => {
        
        
        const type = detail.match(/Object: (\d)/)[1];
        switch (type) {
            case '0':
                defectCounts.rassloenie++;
                break;

            case '1':
                defectCounts.skol++;
                break;

            case '2':
                defectCounts.treshina++;
                break;
            case '3':
                defectCounts.ugolok_treshina++;

            case '4':
                defectCounts.vidbutosti++;
                break;

            case '5':
                defectCounts.vidbutosti_200++;
                break;

            case '6':
                defectCounts.zaterto_valami++;
                break;


  
            default:
                break;
        }
    });

    return defectCounts;
}

module.exports = { determineDefectCounts };
