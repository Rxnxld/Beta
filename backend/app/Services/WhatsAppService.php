<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiUrl;
    protected ?string $phoneNumberId;
    protected ?string $accessToken;

    public function __construct()
    {
        $this->apiUrl = config('whatsapp.api_url');
        $this->phoneNumberId = config('whatsapp.phone_number_id');
        $this->accessToken = config('whatsapp.access_token');
    }

    public function sendMessage(string $to, string $message): array
    {
        $url = "{$this->apiUrl}/{$this->phoneNumberId}/messages";

        $response = Http::withToken($this->accessToken)
            ->post($url, [
                'messaging_product' => 'whatsapp',
                'to' => $this->normalizePhone($to),
                'type' => 'text',
                'text' => [
                    'body' => $message,
                ],
            ]);

        if ($response->failed()) {
            Log::error('WhatsApp API error: ' . $response->body());
            throw new \Exception('Error al enviar mensaje de WhatsApp: ' . $response->body());
        }

        return $response->json();
    }

    public function sendMedia(string $to, string $mediaUrl, string $caption = ''): array
    {
        $url = "{$this->apiUrl}/{$this->phoneNumberId}/messages";

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $this->normalizePhone($to),
            'type' => 'document',
            'document' => [
                'link' => $mediaUrl,
                'caption' => $caption,
            ],
        ];

        $response = Http::withToken($this->accessToken)
            ->post($url, $payload);

        if ($response->failed()) {
            Log::error('WhatsApp API error: ' . $response->body());
            throw new \Exception('Error al enviar multimedia por WhatsApp: ' . $response->body());
        }

        return $response->json();
    }

    public function sendFactura(string $to, string $pdfPath, string $clienteName): array
    {
        $url = asset('storage/' . $pdfPath);
        $caption = "Hola {$clienteName}, adjuntamos su factura. ¡Gracias por su preferencia!";

        return $this->sendMedia($to, $url, $caption);
    }

    protected function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (substr($phone, 0, 1) !== '+') {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
