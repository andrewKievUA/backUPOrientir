export const calculateStatistics = (data) => {
    if (data.length === 0) return {};

    console.log(data);
    
  
    const totalPallets = data.length;
    const defectivePallets = data.filter(item => item.brak_persent_total > 5);
    const defectiveCount = defectivePallets.length;
  
    const sizes = {};
  
    const cubicMeters = {
      100: 2.16,
      120: 2.16,
      150: 2.16,
      200: 2.16,
      250: 2.1,
      280: 2.016,
      300: 2.16,
      375: 1.8,
      400: 1.92,
      500: 1.8
  };
  
    const cubicMetersStone = {
      100: 0.012,
      120: 0.0144,
      150: 0.018,
      200: 0.024,
      250: 0.03,
      280: 0.0336,
      300: 0.036,
      375: 0.045,
      400: 0.048,
      500: 0.06,
    };
  
    let totalKubatura = 0;         // Общая кубатура
    let totalKubaturaBrak = 0;     // Кубатура брака
    let brackPers = 0
  
    data.forEach(item => {
      sizes[item.type_1c] = sizes[item.type_1c] || { count: 0, num_defects: 0, kubatura: 0, kubaturaBrak: 0 };
      sizes[item.type_1c].count += 1;
      sizes[item.type_1c].num_defects += item.num_defects;
      brackPers += item.brak_persent_total
  
      // Добавление к общей кубатуре
      if (cubicMeters[item.type_1c]) {
        sizes[item.type_1c].kubatura += cubicMeters[item.type_1c];
        totalKubatura += cubicMeters[item.type_1c];
      }
  
      // Добавление к кубатуре брака
      if (cubicMetersStone[item.type_1c]) {
        sizes[item.type_1c].kubaturaBrak += item.num_defects * cubicMetersStone[item.type_1c];
        totalKubaturaBrak += item.num_defects * cubicMetersStone[item.type_1c];
      }
    });
  
    // Вычисление процента брака по отношению к общей кубатуре
    // const brakPercentage = (totalKubaturaBrak / totalKubatura) * 100;  item.brak_persent_total
    const brakPercentage = brackPers/totalPallets
    const defectivePercentage = (defectiveCount / totalPallets) * 100;
  
    return { 
      totalPallets, 
      defectiveCount, 
      sizes, 
      defectivePercentage, 
      brakPercentage,      // Процент брака
      defectivePallets,
      totalKubatura,
      totalKubaturaBrak
    };
  };
  