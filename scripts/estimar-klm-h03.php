<?php

/**
 * Script de estimación KLM para H-03 (Apertura y Cierre de Caja)
 * Modelo Keystroke-Level Model (Card, Moran & Newell)
 * K = 0.28 s (digitador promedio)
 * M = 1.35 s (preparación mental)
 */

$csvPath = __DIR__ . '/../producto/semana-14/mediciones/h03-tiempos-sistema.csv';
$resumenPath = __DIR__ . '/../producto/semana-14/mediciones/h03-resumen.txt';

if (!file_exists($csvPath)) {
    fwrite(STDERR, "Error: No existe el archivo $csvPath. Ejecute primero php artisan test --group=h03 con H03_REGISTRAR=1.\n");
    exit(1);
}

$lineas = file($csvPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
if (count($lineas) <= 1) {
    fwrite(STDERR, "Error: El archivo CSV está vacío o solo contiene encabezados.\n");
    exit(1);
}

$header = str_getcsv(array_shift($lineas));
$datos = ['apertura' => [], 'cierre' => []];

foreach ($lineas as $l) {
    $row = str_getcsv($l);
    if (count($row) >= 3) {
        $op = trim($row[0]);
        $ensayo = (int) $row[1];
        $seg = (float) $row[2];
        if (isset($datos[$op])) {
            $datos[$op][$ensayo] = $seg;
        }
    }
}

// Parámetros KLM
$K = 0.28;
$M = 1.35;

// Apertura: M (1.35) + F2 (K) + escribir '50000' (5*K) + Enter (K) = M + 7*K = 3.31 s
$klmApertura = $M + (7 * $K);

// Cierre: M (1.35) + F9 (K) + M (recordar monto, 1.35) + escribir '53000' (5*K) + Enter (K) = 2*M + 7*K = 4.66 s
$klmCierre = (2 * $M) + (7 * $K);

$umbral = 60.0;

$out = "================================================================================\n";
$out .= "RESUMEN DE TIEMPOS DE OPERACION H-03 (SISTEMA + ESTIMADO KLM)\n";
$out .= "================================================================================\n";
$out .= sprintf("Fecha de generación: %s\n", date('Y-m-d H:i:s'));
$out .= "Parámetros KLM estándar: K = 0.28 s (tecla), M = 1.35 s (preparación mental)\n";
$out .= sprintf("Estimado operador Apertura (M + F2 + '50000' + Enter): %.2f s\n", $klmApertura);
$out .= sprintf("Estimado operador Cierre (M + F9 + M + '53000' + Enter): %.2f s\n", $klmCierre);
$out .= sprintf("Umbral de éxito comprometido: <= %.1f s\n\n", $umbral);

$out .= "--------------------------------------------------------------------------------\n";
$out .= "1. OPERACION: APERTURA DE TURNO (POST /caja/abrir)\n";
$out .= "--------------------------------------------------------------------------------\n";
$out .= "Ensayo | Tiempo Sistema (s) | Estimado KLM (s) | Total Estimado (s) | Umbral | Cumple\n";
$out .= "-------+--------------------+------------------+--------------------+--------+-------\n";

$tiemposAp = $datos['apertura'];
$totalEstimadoAp = [];
foreach ($tiemposAp as $i => $tSis) {
    $tot = $tSis + $klmApertura;
    $totalEstimadoAp[] = $tot;
    $cumple = $tot <= $umbral ? 'CUMPLE' : 'NO CUMPLE';
    $out .= sprintf("  %d    |       %7.4f      |      %6.2f      |       %7.4f      | <=60s  | %s\n", $i, $tSis, $klmApertura, $tot, $cumple);
}
$promSisAp = count($tiemposAp) ? array_sum($tiemposAp) / count($tiemposAp) : 0;
$maxSisAp = count($tiemposAp) ? max($tiemposAp) : 0;
$promTotAp = count($totalEstimadoAp) ? array_sum($totalEstimadoAp) / count($totalEstimadoAp) : 0;
$maxTotAp = count($totalEstimadoAp) ? max($totalEstimadoAp) : 0;

$out .= sprintf("Promedio: Sistema = %.4f s | Total estimado = %.4f s\n", $promSisAp, $promTotAp);
$out .= sprintf("Máximo:   Sistema = %.4f s | Total estimado = %.4f s\n\n", $maxSisAp, $maxTotAp);

$out .= "--------------------------------------------------------------------------------\n";
$out .= "2. OPERACION: CIERRE CON ARQUEO CIEGO (POST /caja/cerrar)\n";
$out .= "--------------------------------------------------------------------------------\n";
$out .= "Ensayo | Tiempo Sistema (s) | Estimado KLM (s) | Total Estimado (s) | Umbral | Cumple\n";
$out .= "-------+--------------------+------------------+--------------------+--------+-------\n";

$tiemposCi = $datos['cierre'];
$totalEstimadoCi = [];
foreach ($tiemposCi as $i => $tSis) {
    $tot = $tSis + $klmCierre;
    $totalEstimadoCi[] = $tot;
    $cumple = $tot <= $umbral ? 'CUMPLE' : 'NO CUMPLE';
    $out .= sprintf("  %d    |       %7.4f      |      %6.2f      |       %7.4f      | <=60s  | %s\n", $i, $tSis, $klmCierre, $tot, $cumple);
}
$promSisCi = count($tiemposCi) ? array_sum($tiemposCi) / count($tiemposCi) : 0;
$maxSisCi = count($tiemposCi) ? max($tiemposCi) : 0;
$promTotCi = count($totalEstimadoCi) ? array_sum($totalEstimadoCi) / count($totalEstimadoCi) : 0;
$maxTotCi = count($totalEstimadoCi) ? max($totalEstimadoCi) : 0;

$out .= sprintf("Promedio: Sistema = %.4f s | Total estimado = %.4f s\n", $promSisCi, $promTotCi);
$out .= sprintf("Máximo:   Sistema = %.4f s | Total estimado = %.4f s\n\n", $maxSisCi, $maxTotCi);

$out .= "--------------------------------------------------------------------------------\n";
$out .= "3. EVALUACION GLOBAL DE LA HIPOTESIS H-03\n";
$out .= "--------------------------------------------------------------------------------\n";
$aperturasOk = $maxTotAp <= $umbral;
$cierresOk = $maxTotCi <= $umbral;
$globalOk = $aperturasOk && $cierresOk;

$out .= sprintf("Aperturas (máx %.4f s <= 60 s): %s\n", $maxTotAp, $aperturasOk ? 'CUMPLE' : 'NO CUMPLE');
$out .= sprintf("Cierres   (máx %.4f s <= 60 s): %s\n", $maxTotCi, $cierresOk ? 'CUMPLE' : 'NO CUMPLE');
$out .= sprintf("Resultado global de H-03: %s\n", $globalOk ? 'VALIDADA' : 'NO VALIDADA');
$out .= "================================================================================\n";

file_put_contents($resumenPath, $out);
echo $out;
echo "\nResumen guardado exitosamente en: $resumenPath\n";
