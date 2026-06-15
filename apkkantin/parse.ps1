$content = Get-Content -Raw -Path 'C:\Users\aamir\.gemini\antigravity-ide\brain\cc641781-e0db-4e09-8620-0d9c366e4dc6\.system_generated\steps\128\content.md'
$idx = $content.IndexOf('{')
$jsonStr = $content.Substring($idx)
$json = ConvertFrom-Json $jsonStr
$json.jobs | ForEach-Object {
    Write-Output "Job: $($_.name) - Conclusion: $($_.conclusion)"
    $_.steps | ForEach-Object {
        Write-Output "  Step: $($_.name) | Status: $($_.status) | Conclusion: $($_.conclusion)"
    }
}
