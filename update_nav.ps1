$files = Get-ChildItem -Filter "*.html" | Where-Object { $_.Name -ne "metiers.html" -and $_.Name -ne "404.html" -and $_.Name -ne "legal.html" }
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $c = $c -replace '>Identit\u00e9<', '>Qui sommes-nous<'
    $c = $c -replace '>Nos M\u00e9tiers<', ">Nos domaines d'expertise<"
    $c = $c -replace '>Secteurs<', ">Nos secteurs d'intervention<"
    $c = $c -replace '>Nos Solutions<', '>Nos clients<'
    # Also update nav-cta link to be a plain link
    [System.IO.File]::WriteAllText($f.FullName, $c, [System.Text.Encoding]::UTF8)
    Write-Host "Updated: $($f.Name)"
}
Write-Host "All done"
