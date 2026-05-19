package uz.castmap.player.features.settings

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
fun SettingsScreen(
    onClose: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val info = listOf(
        "Device name" to state.deviceName,
        "Device ID" to state.deviceId,
        "Organization" to state.organization,
        "Branch" to state.branch,
        "Pairing status" to state.pairingStatus,
        "Internet status" to state.internetStatus,
        "IP address" to state.ipAddress,
        "App version" to state.appVersion,
        "Current playlist" to state.currentPlaylist,
        "Last sync" to state.lastSync,
        "Storage usage" to state.storageUsage,
        "Cache size" to state.cacheSize
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xDD000000))
            .padding(34.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .border(BorderStroke(1.dp, Color(0xFFD4AF37)), RoundedCornerShape(22.dp))
                .background(Color(0xFF0A0A0A), RoundedCornerShape(22.dp))
                .padding(28.dp),
            verticalArrangement = Arrangement.spacedBy(22.dp)
        ) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text("CASTMAP sozlamalari", color = Color(0xFFF5F5F5), fontSize = 30.sp, fontWeight = FontWeight.Bold)
                    Text("OK tugmasi 5 soniya bosilganda ochiladi", color = Color(0xFFA1A1AA), fontSize = 14.sp)
                }
                Button(onClick = onClose, colors = goldButtonColors()) { Text("Yopish") }
            }

            LazyVerticalGrid(
                modifier = Modifier.weight(1f),
                columns = GridCells.Fixed(4),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(info) { (label, value) ->
                    InfoCard(label, value.ifBlank { "-" })
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                ActionButton("Sinxronlash", viewModel::refresh)
                ActionButton("Keshni tozalash") {}
                ActionButton("Qayta ishga tushirish") {}
                ActionButton("Qurilmani uzish", viewModel::unpair, danger = true)
            }
        }
    }
}

@Composable
private fun InfoCard(label: String, value: String) {
    Column(
        modifier = Modifier
            .background(Color(0xFF111111), RoundedCornerShape(14.dp))
            .border(BorderStroke(1.dp, Color.White.copy(alpha = 0.08f)), RoundedCornerShape(14.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(label, color = Color(0xFFA1A1AA), fontSize = 12.sp)
        Text(value, color = Color(0xFFF5F5F5), fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun ActionButton(label: String, onClick: () -> Unit, danger: Boolean = false) {
    Button(
        onClick = onClick,
        colors = if (danger) ButtonDefaults.buttonColors(containerColor = Color(0xFF7F1D1D), contentColor = Color.White) else goldButtonColors()
    ) {
        Text(label, modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp))
    }
}

@Composable
private fun goldButtonColors() = ButtonDefaults.buttonColors(
    containerColor = Color(0xFFD4AF37),
    contentColor = Color(0xFF0A0A0A)
)
