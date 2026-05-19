package uz.castmap.player.features.error

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun NoContentScreen(onSync: () -> Unit) {
    StatusScreen(
        title = "Kontent mavjud emas",
        message = "Admin paneldan playlist biriktiring yoki sinxronlashni tekshiring.",
        action = "Sinxronlash",
        onAction = onSync
    )
}

@Composable
fun OfflineScreen(message: String = "Offline kontent ijro qilinmoqda") {
    StatusScreen(
        title = "Internet aloqasi yo‘q",
        message = message,
        action = null,
        onAction = {}
    )
}

@Composable
fun StatusScreen(title: String, message: String, action: String?, onAction: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF0A0A0A)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .border(BorderStroke(1.dp, Color(0xFFD4AF37)), RoundedCornerShape(20.dp))
                .background(Color(0xFF111111), RoundedCornerShape(20.dp))
                .padding(36.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Text("!", color = Color(0xFFD4AF37), fontSize = 64.sp, fontWeight = FontWeight.Black)
            Text(title, color = Color(0xFFF5F5F5), fontSize = 30.sp, fontWeight = FontWeight.Bold)
            Text(message, color = Color(0xFFA1A1AA), fontSize = 18.sp)
            if (action != null) {
                Button(
                    onClick = onAction,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD4AF37), contentColor = Color.Black)
                ) {
                    Text(action)
                }
            }
        }
    }
}
