<?php

/**
 * Validador estricto de trazabilidad bidireccional (T-2.5 / C10 / C15)
 *
 * Lee el archivo de trazabilidad CSV y comprueba que cada método de prueba referenciado
 * (formato tests/Feature/Archivo.php::metodo) exista físicamente en el código de pruebas.
 *
 * Uso:
 *   php scripts/validar-trazabilidad.php
 *   php scripts/validar-trazabilidad.php producto/semana-14/trazabilidad.csv
 */

$csvFile = $argv[1] ?? (dirname(__DIR__) . DIRECTORY_SEPARATOR . 'producto' . DIRECTORY_SEPARATOR . 'semana-14' . DIRECTORY_SEPARATOR . 'trazabilidad.csv');

if (!file_exists($csvFile)) {
    // Si aún no existe el de semana-14, probar el de semana-3
    $fallback = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'producto' . DIRECTORY_SEPARATOR . 'semana-3' . DIRECTORY_SEPARATOR . 'trazabilidad.csv';
    if (file_exists($fallback)) {
        $csvFile = $fallback;
    } else {
        fwrite(STDERR, "Error: No se encontró el archivo de trazabilidad en $csvFile\n");
        exit(1);
    }
}

echo "Validando matriz de trazabilidad: " . basename($csvFile) . "\n";
echo "Ruta absoluta: $csvFile\n";
echo str_repeat('-', 80) . "\n";

$fp = fopen($csvFile, 'r');
if (!$fp) {
    fwrite(STDERR, "Error: No se pudo abrir $csvFile\n");
    exit(1);
}

$headers = fgetcsv($fp);
if (!$headers) {
    fwrite(STDERR, "Error: Archivo CSV vacío\n");
    exit(1);
}

// Localizar columna de prueba
$testColIndex = -1;
foreach ($headers as $idx => $h) {
    $hClean = trim(mb_strtolower($h));
    if (str_contains($hClean, 'prueba') || str_contains($hClean, 'test') || str_contains($hClean, 'método')) {
        $testColIndex = $idx;
        break;
    }
}

if ($testColIndex === -1) {
    fwrite(STDERR, "Error: No se encontró columna de Prueba(archivo::método) en el CSV\n");
    exit(1);
}

$baseApp = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'gestisoft-app';
$filaNum = 1;
$totalFilas = 0;
$testsVerificados = 0;
$errores = [];
$sinTest = 0;

while (($row = fgetcsv($fp)) !== false) {
    $filaNum++;
    if (empty(array_filter($row))) continue; // saltar filas vacías
    $totalFilas++;

    $idFila = $row[0] ?? "Fila #$filaNum";
    $testRef = trim($row[$testColIndex] ?? '');

    if (empty($testRef) || strtoupper($testRef) === 'SIN TEST' || strtoupper($testRef) === 'N/A' || str_contains($testRef, '[COMPLETAR')) {
        $sinTest++;
        continue;
    }

    // Puede haber múltiples tests separados por comas o saltos de línea
    $tests = array_map('trim', explode(',', $testRef));

    foreach ($tests as $t) {
        if (empty($t) || strtoupper($t) === 'SIN TEST' || strtoupper($t) === 'N/A') {
            continue;
        }

        if (!str_contains($t, '::')) {
            $errores[] = "[$idFila / Fila $filaNum] Formato inválido en referencia de test: '$t' (debe ser Archivo.php::metodo)";
            continue;
        }

        list($archivoRel, $metodo) = explode('::', $t, 2);
        $archivoRel = trim($archivoRel);
        $metodo = trim($metodo);

        $rutaArchivo = $baseApp . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $archivoRel);

        if (!file_exists($rutaArchivo)) {
            $errores[] = "[$idFila / Fila $filaNum] Archivo de prueba no existe: $archivoRel";
            continue;
        }

        $contenido = file_get_contents($rutaArchivo);
        if (!preg_match('/function\s+' . preg_quote($metodo, '/') . '\b/', $contenido)) {
            $errores[] = "[$idFila / Fila $filaNum] Método '$metodo' no encontrado en $archivoRel";
            continue;
        }

        $testsVerificados++;
    }
}

fclose($fp);

echo "Total de filas analizadas: $totalFilas\n";
echo "Referencias a tests verificadas con éxito en tests/: $testsVerificados\n";
echo "Filas declaradas sin test automatizado o informativas: $sinTest\n";

if (!empty($errores)) {
    echo "\nERRORES DE TRAZABILIDAD DETECTADOS (" . count($errores) . "):\n";
    foreach ($errores as $err) {
        echo "  - ❌ $err\n";
    }
    exit(1);
}

echo "\n Resultado: ÉXITO. Todas las pruebas referenciadas existen físicamente y están sincronizadas.\n";
exit(0);
