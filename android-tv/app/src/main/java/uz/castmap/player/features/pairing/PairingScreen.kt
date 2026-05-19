package uz.castmap.player.features.pairing

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle

@Composable
fun PairingScreen(
    onPaired: () -> Unit,
    viewModel: PairingViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    LaunchedEffect(state.paired) {
        if (state.paired) onPaired()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0A0A))
            .padding(48.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(22.dp)) {
            Text("CM  CASTMAP", color = Color(0xFFD4AF37), fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Text("Qurilmani ulash", color = Color(0xFFF5F5F5), fontSize = 36.sp, fontWeight = FontWeight.Bold)
            Text("Admin panelda ushbu kodni kiriting", color = Color(0xFFA1A1AA), fontSize = 18.sp)

            Row(horizontalArrangement = Arrangement.spacedBy(22.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(124.dp)
                        .border(BorderStroke(1.dp, Color(0xFFD4AF37)), RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("QR", color = Color(0xFFD4AF37), fontSize = 28.sp, fontWeight = FontWeight.Bold)
                }
                Box(
                    modifier = Modifier
                        .border(BorderStroke(2.dp, Color(0xFFD4AF37)), RoundedCornerShape(14.dp))
                        .padding(horizontal = 46.dp, vertical = 22.dp)
                ) {
                    Text(state.pairingCode, color = Color(0xFFD4AF37), fontSize = 56.sp, fontWeight = FontWeight.Black)
                }
            }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                CircularProgressIndicator(color = Color(0xFFD4AF37), modifier = Modifier.size(24.dp))
                Text(state.statusText, color = Color(0xFFF5F5F5), fontSize = 18.sp)
            }

            Spacer(Modifier.height(12.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF111111), RoundedCornerShape(18.dp))
                    .border(BorderStroke(1.dp, Color.White.copy(alpha = 0.08f)), RoundedCornerShape(18.dp))
                    .padding(22.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                PairingInfo("Device ID", state.temporaryDeviceId.ifBlank { "CM-BOX-01A2B" })
                PairingInfo("IP address", state.ipAddress)
                PairingInfo("Wi-Fi", state.wifiStatus)
                PairingInfo("App version", state.appVersion)
            }
        }
    }
}

@Composable
private fun PairingInfo(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(label, color = Color(0xFFA1A1AA), fontSize = 12.sp)
        Text(value, color = Color(0xFFF5F5F5), fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
    }
}
