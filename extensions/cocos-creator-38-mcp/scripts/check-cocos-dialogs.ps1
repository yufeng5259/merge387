param(
  [switch]$Json,
  [switch]$FailOnDialog
)

$ErrorActionPreference = 'Stop'

Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class CocosDialogWindowEnum {
  public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
}
"@

$windows = New-Object System.Collections.ArrayList
[CocosDialogWindowEnum]::EnumWindows({
  param($handle, $lParam)
  if ([CocosDialogWindowEnum]::IsWindowVisible($handle)) {
    $titleBuilder = New-Object System.Text.StringBuilder 512
    [void][CocosDialogWindowEnum]::GetWindowText($handle, $titleBuilder, $titleBuilder.Capacity)
    $title = $titleBuilder.ToString()
    if ($title) {
      $processId = 0
      [void][CocosDialogWindowEnum]::GetWindowThreadProcessId($handle, [ref]$processId)
      [void]$windows.Add([pscustomobject]@{ processId = $processId; title = $title })
    }
  }
  return $true
}, [IntPtr]::Zero) | Out-Null

$dialogs = @($windows | Where-Object {
  $_.title -match '^(璀﹀憡|淇濆瓨)$' -or
  $_.title -match 'Prefab 鏁版嵁|鏄惁瑕佹妸鏁版嵁淇濆瓨|Save|Warning' -or
  $_.title -match '保存|警告|是否|数据|关闭|升级'
})

$result = [pscustomobject]@{
  ok = ($dialogs.Count -eq 0)
  dialogCount = $dialogs.Count
  dialogs = $dialogs
}

if ($Json) {
  $result | ConvertTo-Json -Depth 8
} else {
  $result
}

if ($FailOnDialog -and $dialogs.Count -gt 0) {
  exit 2
}

