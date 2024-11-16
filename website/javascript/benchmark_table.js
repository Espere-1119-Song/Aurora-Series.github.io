document.addEventListener('DOMContentLoaded', function () {
    fetch('data/behavior_total_benchmark.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(behavior_total_benchmark_data => {
            console.log("Loaded data:", behavior_total_benchmark_data);
            
            var getColumnMinMax = (data, field) => {
                let values = data.map(item => item[field]).filter(val => val !== "-").map(Number);
                return { min: Math.min(...values), max: Math.max(...values) };
            };

            var behavior_columns = [
                {
                    title: "Model Family",
                    field: "model",
                    widthGrow: 1.5,
                    minWidth: 140
                },
                {
                    title: "# F",
                    field: "frames",
                    widthGrow: 0.9,
                    minWidth: 100
                },
                {
                    title: "TPF",
                    field: "tpf",
                    widthGrow: 0.9,
                    minWidth: 60
                },
                {
                    title: "Avg. VDC",
                    columns: [
                        { title: "Acc.", field: "avg_acc", hozAlign: "center", formatter: colorFormatterAvg, minWidth: 50 },
                        { title: "Score", field: "avg_score", hozAlign: "center", formatter: colorFormatterAvg, minWidth: 70 },
                    ]
                },
                {
                    title: "Detailed",
                    columns: [
                        { title: "Acc.", field: "detailed_acc", hozAlign: "center", formatter: colorFormatterGoalInt, minWidth: 50 },
                        { title: "Score", field: "detailed_score", hozAlign: "center", formatter: colorFormatterGoalInt, minWidth: 70 },
                    ]
                },
                {
                    title: "Camera",
                    columns: [
                        { title: "Acc.", field: "camera_acc", hozAlign: "center", formatter: colorFormatterActionSeq, minWidth: 50 },
                        { title: "Score", field: "camera_score", hozAlign: "center", formatter: colorFormatterActionSeq, minWidth: 70 },
                    ]
                },
                {
                    title: "Short",
                    columns: [
                        { title: "Acc.", field: "short_acc", hozAlign: "center", formatter: colorFormatterSubgoal, minWidth: 50 },
                        { title: "Score", field: "short_score", hozAlign: "center", formatter: colorFormatterSubgoal, minWidth: 70 },
                    ]
                },
                {
                    title: "Background",
                    columns: [
                        { title: "Acc.", field: "background_acc", hozAlign: "center", formatter: colorFormatterTrans, minWidth: 50 },
                        { title: "Score", field: "background_score", hozAlign: "center", formatter: colorFormatterTrans, minWidth: 70 },
                    ]
                },
                {
                    title: "Object",
                    columns: [
                        { title: "Acc.", field: "object_acc", hozAlign: "center", formatter: colorFormatterObject, minWidth: 50 },
                        { title: "Score", field: "object_score", hozAlign: "center", formatter: colorFormatterObject, minWidth: 70 },
                    ]
                }
            ];

            behavior_columns.forEach(column => {
                if (column.columns) {
                    column.columns.forEach(subColumn => {
                        let { min, max } = getColumnMinMax(behavior_total_benchmark_data, subColumn.field);
                        subColumn.formatterParams = { min, max };
                    });
                } else if (column.field !== "overall_performance") {
                    let { min, max } = getColumnMinMax(behavior_total_benchmark_data, column.field);
                    column.formatterParams = { min, max };
                }
            });

            var behavior_table = new Tabulator("#behavior-benchmark-main-table", {
                data: behavior_total_benchmark_data,
                layout: "fitColumns",
                responsiveLayout: "collapse",
                responsiveLayoutCollapseStartOpen: false,
                movableColumns: false,
                initialSort: [
                    { column: "avg_acc", dir: "desc" },
                ],
                columnDefaults: {
                    tooltip: true,
                },
                columns: behavior_columns
            });

            behavior_table.on("tableBuilt", function(){
                console.log("Table built successfully");
            });

            behavior_table.on("dataLoaded", function(data){
                console.log("Data loaded:", data);
            });

            behavior_table.on("dataLoadError", function(error){
                console.error("Error loading data:", error);
            });
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
});

